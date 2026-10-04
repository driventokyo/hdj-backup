(function(){
  var m=document.querySelector(".menu"),n=document.getElementById("nav");
  if(m&&n)m.addEventListener("click",function(){var o=n.classList.toggle("open");m.setAttribute("aria-expanded",o?"true":"false")});
  // Moduli di contatto
  document.querySelectorAll("form.lead").forEach(function(f){
    f.addEventListener("submit",function(e){
      e.preventDefault();var st=f.querySelector(".status");st.className="status";
      if(!f.checkValidity()){st.textContent=st.dataset.invalid;st.classList.add("err");var bad=f.querySelector(":invalid");if(bad)bad.focus();return}
      var fd=new FormData(f),o={};fd.forEach(function(v,k){if(o[k]!==undefined){o[k]=[].concat(o[k],v)}else o[k]=v});
      ["languages"].forEach(function(k){if(o[k]&&!Array.isArray(o[k]))o[k]=[o[k]]});
      var p=new URLSearchParams(location.search);["utm_source","utm_medium","utm_campaign"].forEach(function(k){if(p.get(k))o[k]=p.get(k)});
      o.referrer=document.referrer||"";o.landing=location.pathname;
      var b=f.querySelector("button[type=submit]");b.disabled=true;st.textContent=st.dataset.sending;
      fetch("/api/lead",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(o)}).then(function(r){return r.json().then(function(j){return{ok:r.ok,j:j}})}).then(function(x){
        if(x.ok&&x.j.ok){st.textContent=st.dataset.ok+(x.j.id?" ("+x.j.id+")":"");st.classList.add("ok");f.reset();if(window.turnstile)turnstile.reset()}
        else{st.textContent=st.dataset.err;st.classList.add("err")}
      }).catch(function(){st.textContent=st.dataset.err;st.classList.add("err")}).finally(function(){b.disabled=false});
    });
  });
  // Verifica certificato: numero -> /verify/{id}; QR con BarcodeDetector se disponibile
  document.querySelectorAll("form[data-verify]").forEach(function(f){
    var lang=document.documentElement.lang.indexOf("zh")===0?"zh":document.documentElement.lang;
    f.addEventListener("submit",function(e){e.preventDefault();var v=f.querySelector("input").value.trim();if(/^\d{4}-\d{4}$/.test(v))location.href="/verify/"+v+"?lang="+lang;else f.querySelector("input").focus()});
    var sb=f.querySelector("[data-scan]"),vid=f.querySelector("[data-cam]");
    if(sb&&"BarcodeDetector" in window&&navigator.mediaDevices){sb.hidden=false;sb.addEventListener("click",function(){
      var det=new BarcodeDetector({formats:["qr_code"]});
      navigator.mediaDevices.getUserMedia({video:{facingMode:"environment"}}).then(function(s){vid.hidden=false;vid.srcObject=s;vid.play();
        var t=setInterval(function(){det.detect(vid).then(function(c){if(c.length){var u=c[0].rawValue;clearInterval(t);s.getTracks().forEach(function(x){x.stop()});
          try{var url=new URL(u,location.href);if(url.origin===location.origin&&url.pathname.indexOf("/verify/")===0){location.href=url.href;return}}catch(_){}
          var m=String(u).match(/\d{4}-\d{4}/);if(m)location.href="/verify/"+m[0]+"?lang="+lang}}).catch(function(){})},400)}).catch(function(){sb.hidden=true});
    })}
  });
})();

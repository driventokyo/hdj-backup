// Programma completo del corso VVIP per il DOCENTE: struttura dei 3 giorni, regole, note didattiche, esercizi, esami, checklist.
// Ogni testo e' una coppia [giapponese, inglese]. Le regole specifiche vengono dal fondatore (odori, 23 gradi, aerazione ogni 15 minuti,
// niente cibo, mai parlare per primi, ombrello, buste) e dalle linee guida ricevute dall'ufficio di un CEO del Golfo (2026), citate senza nome.
import { CHAPTERS } from "./chapters.mjs";

export const META = {
  title: ["VVIPサービス研修　講師用プログラム", "VVIP Service Training · Instructor's Programme"],
  edition: ["2026年10月版", "October 2026 edition"],
  confidential: ["講師・運営用。受講者には配布しないでください。", "For instructors and staff. Not for distribution to trainees."],
};

export const INTRO = {
  h: ["この教材の使い方", "How to use this programme"],
  paras: [
    ["この教材は、HIRE driver japan のVVIPサービス研修を担当する講師のためのものです。3日間の構成、各章で必ず教える規則、講師ノート、演習、試験の採点基準、現場で使うチェックリストをまとめています。", "This programme is for the instructor delivering the HIRE driver japan VVIP service training. It sets out the three-day structure, the rules that must be taught in every chapter, teaching notes, exercises, exam marking criteria and the checklists used on the job."],
    ["受講者はハイヤー・タクシー事業者の乗務員で、1回あたり最大5名です。研修は事業者の営業所で行い、1日目と2日目は Zoom または Google Meet でも実施できます。3日目の実地練習と実地試験は必ず現場で、受講者の車両を使って行います。", "Trainees are drivers employed by hire and taxi operators, up to five per session. Training takes place at the operator's depot; days 1 and 2 can also be delivered by Zoom or Google Meet. Day 3, the in-car practice and practical exam, always takes place on site with the trainees' own vehicles."],
    ["教え方の基本は「規則を言い、理由を言い、やって見せ、やらせる」です。各章の「必ず教える規則」は、試験で問われる内容と同じです。講師の裁量で順番や例は変えて構いませんが、規則の内容は変えないでください。", "The teaching method is: state the rule, give the reason, demonstrate it, have them do it. The rules marked as mandatory in each chapter are exactly what the exams test. Instructors may change the order and the examples, not the rules."],
  ],
  materials: { h: ["講師が用意するもの", "What the instructor brings"], items: [
    ["この教材と、受講者用の学習テキスト（各章のPDF）", "This programme and the trainees' study texts (one PDF per chapter)"],
    ["ネームボードの見本（本名用・合図用）", "Sample name boards (real name and code sign)"],
    ["ミニバーとアメニティの見本一式（付録Cの一覧どおり）", "A full sample minibar and amenity kit (as listed in Appendix C)"],
    ["車内温度計、消臭用の無香タイプの清掃用品", "A cabin thermometer and unscented cleaning products"],
    ["大きめの傘2本（黒、無地）", "Two large plain black umbrellas"],
    ["付録のチェックリストを人数分印刷したもの", "Printed copies of the appendix checklists for every trainee"],
    ["採点表（口頭・実地）を人数分", "Marking sheets (oral and practical) for every trainee"],
  ] },
};

export const TIMETABLE = {
  h: ["3日間の構成", "The three-day structure"],
  note: ["1日7時間（休憩を除く）。昼休憩60分、午前と午後に10分の休憩を入れます。", "Seven teaching hours a day, excluding breaks: a 60-minute lunch and a 10-minute break in each half."],
  days: [
    { h: ["1日目　VVIPの基準（日本語または英語）", "Day 1 · The VVIP standard (Japanese or English)"], rows: [
      ["09:00", "開講、自己紹介、研修の目的と試験の説明", "Opening, introductions, aims of the course and how the exams work"],
      ["09:30", "第1章　VVIPの基準とは", "Ch. 1 · What the VVIP standard means"],
      ["10:15", "第2章　欧米・中東のお客さまの特徴", "Ch. 2 · Western and Middle Eastern clients"],
      ["11:10", "第3章　ドライバーの準備（身だしなみ、におい、持ち物）", "Ch. 3 · Driver preparation (grooming, odours, kit)"],
      ["12:00", "昼休憩", "Lunch"],
      ["13:00", "第4章　車両の準備（点検、清掃、におい、換気、温度）", "Ch. 4 · Vehicle preparation (checks, cleaning, odours, airing, temperature)"],
      ["14:00", "第5章　ミニバーとアメニティ", "Ch. 5 · Minibar and amenities"],
      ["14:40", "第6章　ネームボード", "Ch. 6 · The name board"],
      ["15:10", "第7章　行程の準備", "Ch. 7 · Preparing the itinerary"],
      ["15:50", "第8章　出迎え、ドア、席次、荷物、雨の日", "Ch. 8 · Greeting, doors, seating, luggage, rain"],
      ["16:40", "第9章　車内での振る舞い：話しかけない", "Ch. 9 · Conduct in the car: do not initiate"],
      ["17:20", "第10章　守秘とSNS　／　第11章　秘書・警護との連携　／　第12章　想定外の事態", "Ch. 10 · Confidentiality and social media / Ch. 11 · Assistants and security / Ch. 12 · The unexpected"],
      ["18:00", "1日目の振り返り、筆記試験の範囲の確認", "Day 1 review and written-exam scope"],
    ] },
    { h: ["2日目　接客の外国語（英語中心）", "Day 2 · Service language (mainly English)"], rows: [
      ["09:00", "第13章　60のフレーズ（場面1〜4）", "Ch. 13 · The 60 phrases (situations 1 to 4)"],
      ["10:30", "第14章　発音の練習", "Ch. 14 · Pronunciation practice"],
      ["11:15", "第13章続き　60のフレーズ（場面5〜7）", "Ch. 13 continued · Phrases (situations 5 to 7)"],
      ["12:00", "昼休憩", "Lunch"],
      ["13:00", "第15章　ロールプレイ：空港、ホテル", "Ch. 15 · Role play: airport and hotel"],
      ["14:30", "第16章　ロールプレイ：レストラン、買い物、緊急時", "Ch. 16 · Role play: restaurant, shopping, emergencies"],
      ["16:00", "第17章　翻訳アプリの正しい使い方", "Ch. 17 · Using translation apps properly"],
      ["16:30", "第18章　確認・遅れ・お詫びのメッセージ", "Ch. 18 · Confirmation, delay and apology messages"],
      ["17:15", "口頭試験の形式の説明と模擬試験", "Oral exam format and a mock exam"],
      ["18:00", "2日目の振り返り", "Day 2 review"],
    ] },
    { h: ["3日目　車両での実地練習と試験", "Day 3 · In-car practice and exams"], rows: [
      ["09:00", "車両の準備を実際に行う（第4章・第5章の実技）", "Prepare the vehicles for real (practical of chapters 4 and 5)"],
      ["10:00", "シナリオ1　空港の出迎えから降車まで（講師がお客さま役）", "Scenario 1 · Airport pickup to drop-off (instructor plays the client)"],
      ["11:00", "シナリオ2　雨の日のホテル送迎、買い物のお客さま", "Scenario 2 · Hotel pickup in the rain, a client with shopping"],
      ["12:00", "昼休憩", "Lunch"],
      ["13:00", "シナリオ3　警護付きの移動、行程の急な変更", "Scenario 3 · A ride with a security team, a sudden change of plan"],
      ["14:00", "シナリオ4　緊急時（体調不良、渋滞）", "Scenario 4 · Emergencies (illness, traffic)"],
      ["14:45", "実地試験（1人20〜25分）", "Practical exam (20 to 25 minutes per trainee)"],
      ["16:45", "口頭試験（1人10分）", "Oral exam (10 minutes per trainee)"],
      ["17:40", "講評、修了証の説明、筆記試験（オンライン、後日可）の案内", "Feedback, attestation, and how to take the written exam online"],
    ] },
  ],
};

// 章: goals, rules (必ず教える規則), notes (講師ノート), exercise, mistakes
export const DAY1 = [
{ n: 1, h: ["VVIPの基準とは", "What the VVIP standard means"],
  goals: [["VVIPのお客さまが誰で、何を求めているかを説明できる。", "Explain who VVIP clients are and what they expect."], ["「良いサービス」と「VVIPの基準」の違いが言える。", "State the difference between good service and the VVIP standard."]],
  rules: [
    ["優先順位は常に、安全、守秘、快適さ、プロとしての振る舞いの順。", "The priorities, always in this order: safety, confidentiality, comfort, professional conduct."],
    ["乗務員は「見えない存在」。必要なときにはすぐそばに、必要でないときは存在を感じさせない。", "The driver is invisible: present the moment they are needed, unnoticed the rest of the time."],
    ["理想の乗車とは、お客さまが安全に時間どおり到着し、邪魔されず、望めば仕事も休息もでき、不要な会話を強いられないこと。", "The ideal ride: the client arrives safely and on time, undisturbed, free to work or rest, never forced into conversation."],
  ],
  notes: [["冒頭で、実在するお客さまの期待を示す資料（付録D）を配り、「これは実際にお客さまの事務所が書いたもの」と伝えると、規則が講師の好みではなく市場の要求だと理解されます。", "Open by handing out Appendix D, the expectations written by a real client's office, and say so: trainees then see the rules as a market requirement, not the instructor's taste."], ["「一度の小さなミスで次の依頼がほかの会社に行く」例を2つ用意しておく（香り、遅れの連絡なし）。", "Prepare two examples of a small slip that loses the next booking (a scent, a delay with no message)."]],
  exercise: ["受講者に、自分が経験した「お客さまが二度と乗らなかった理由」を1つずつ挙げてもらい、4つの優先順位のどれに当たるかを分類する。", "Each trainee names one reason a client never came back; the group sorts them under the four priorities."],
  mistakes: [["「お客さまを楽しませる」のがサービスだと思っている。VVIPでは静けさがサービス。", "Believing service means entertaining the client. For VVIPs, quiet is the service."]] },

{ n: 2, h: ["欧米・中東のお客さまの特徴", "Western and Middle Eastern clients"],
  goals: [["文化による期待の違いを知り、失礼を避ける。", "Know how expectations differ by culture and avoid offence."], ["分からないことは、事前に秘書に確認する習慣をつける。", "Make it a habit to confirm the unknown with the assistant beforehand."]],
  rules: [
    ["欧米：握手と目を見たあいさつ、Mr. / Ms. + 姓。時間に厳しく、遅れは理由より先に連絡を求める。", "Western clients: handshake and eye contact, Mr. or Ms. plus surname. Punctual; they want to hear about a delay before the reason."],
    ["個人の空間：触れない、近づきすぎない。荷物を持つときも先に聞く。", "Personal space: no touching, no standing too close. Even with luggage, ask first."],
    ["中東：お祈りの時間、ハラール、ラマダン、男女の同乗や握手の習慣。男性乗務員は女性のお客さまに握手を求めない。", "Middle East: prayer times, halal, Ramadan, customs on men and women sharing a car or shaking hands. A male driver never offers a handshake to a female client."],
    ["習慣は本人にではなく、配車担当を通じて秘書に事前確認する。", "Confirm customs with the assistant in advance, through dispatch, never with the client."],
    ["国籍で決めつけない。迷ったら、より丁寧で控えめな方を選ぶ。", "Never judge by nationality. When unsure, choose the more formal and more discreet option."],
  ],
  notes: [["中東の富裕層のお客さまは、乗務員が「見えない」ことと車内の静けさをとくに重視します。付録Dの規則2（会話）と5（におい）はまさにそれを書いています。", "Wealthy Gulf clients place particular weight on an invisible driver and a silent cabin. Rules 2 (conversation) and 5 (smell) in Appendix D say exactly that."]],
  exercise: ["3つのプロフィール（米国の経営者、サウジの家族、フランスの夫妻）を配り、各チームが「事前に秘書に聞く5つの質問」を作る。", "Hand out three profiles (a US executive, a Saudi family, a French couple); each team writes the five questions to ask the assistant in advance."],
  mistakes: [["良かれと思って雑談で「出身はどちらですか」と聞く。個人的な質問は禁止。", "Asking 'Where are you from?' as friendly small talk. Personal questions are forbidden."]] },

{ n: 3, h: ["ドライバーの準備：身だしなみ、におい、持ち物", "Driver preparation: grooming, odours, kit"],
  goals: [["乗務前に自分自身を五つ星ホテルの水準に整えられる。", "Bring yourself to five-star standard before every job."]],
  rules: [
    ["乗務員は無臭であること。香水、オーデコロン、香りの強い柔軟剤、整髪料の香りは禁止。", "The driver is scent-free. No perfume, cologne, strongly scented fabric softener or scented hair products."],
    ["乗務前と乗務中の喫煙は禁止。服と車に残る。", "No smoking before or during a job: it stays on clothes and in the car."],
    ["乗務前と乗務中に、においの強い食事（にんにく、ねぎ、カレー、揚げ物）をとらない。乗務中は車内で食べない、ガムを噛まない。", "No strong-smelling food (garlic, onion, curry, fried food) before or during a job. No eating or chewing gum in the car on duty."],
    ["口臭と手を確認する。乗務前に歯を磨き、ミントを使い、手を洗う。", "Check breath and hands: brush teeth, use a mint and wash hands before the job."],
    ["服装：濃い色のスーツ、白いシャツ、落ち着いたネクタイ、磨いた靴。しわ、汚れ、スポーツ用品、派手な時計や装飾品は不可。", "Dress: dark suit, white shirt, quiet tie, polished shoes. No creases, stains, sportswear, flashy watches or jewellery."],
    ["髪、ひげ、爪を整える。体調と睡眠を整えてから乗務する。", "Hair, beard and nails neat. Arrive rested and well."],
    ["携帯電話はマナーモード。乗務中の私用の通話と操作は禁止（緊急時を除く）。", "Phone on silent. No personal calls or phone use while on duty, except in an emergency."],
    ["持ち物：免許証、行程表、連絡先一覧、ネームボード、傘、予備のシャツ、ミント、ハンカチ2枚。", "Kit: licence, itinerary, contact sheet, name board, umbrella, a spare shirt, mints, two handkerchiefs."],
  ],
  notes: [["においは本人には分かりません。「家族や同僚に聞く」習慣を勧めてください。", "People cannot smell themselves. Recommend asking a family member or colleague."], ["「無臭」は「清潔な石けんの香りまで」と具体的に言うと伝わります。", "Define scent-free concretely: nothing beyond clean soap."]],
  exercise: ["受講者同士で身だしなみチェック（付録A）を行い、直す点を1つずつ指摘する。", "Trainees check each other with Appendix A and each names one thing to fix."],
  mistakes: [["「少しの香水なら良い」と思っている。車内では少しが強い。", "Thinking a little perfume is fine. In a closed cabin, a little is strong."]] },

{ n: 4, h: ["車両の準備：点検、清掃、におい、換気、温度", "Vehicle preparation: checks, cleaning, odours, airing, temperature"],
  goals: [["お客さまが乗る前に、車両を完全な状態にできる。", "Have the vehicle completely ready before the client steps in."], ["車内のにおいと温度を自分で管理できる。", "Control cabin odour and temperature yourself."]],
  rules: [
    ["技術点検：燃料または充電は十分に、タイヤ、灯火、ワイパー、ウォッシャー液、エアコンの動作を確認する。", "Technical check: fuel or charge sufficient; tyres, lights, wipers, washer fluid and air conditioning working."],
    ["外装：洗車済み、ホイールと窓ガラスの汚れなし。内装：シート、足元、ドアポケット、窓の内側、鏡、トランクまで清掃。指紋、髪の毛、砂はお客さまに見られている。", "Exterior washed, wheels and glass clean. Interior: seats, footwells, door pockets, inside glass, mirrors and boot. Fingerprints, hair and grit are noticed."],
    ["車内は無臭が基本。芳香剤、消臭スプレーの香り、たばこ、食べ物のにおいは禁止。清掃用品も無香タイプを使う。", "The cabin is scent-free. No air fresheners, scented sprays, tobacco or food smells. Use unscented cleaning products."],
    ["車内では飲食しない。食べ物を車内に持ち込まない（ミニバーの備品を除く）。", "No eating or drinking in the car. No food brought into the cabin, apart from the minibar stock."],
    ["換気：お客さまが乗っていない間は15分ごとに窓を開けて換気する。乗車の前には必ず一度換気する。", "Airing: while the client is away, open the windows every 15 minutes. Always air the cabin once before the client boards."],
    ["温度：乗車の10分前までに車内を23度に整える。お客さまの指定があればそれに従う。走行中は23度を保ち、変えるのはお客さまが求めたときだけ。", "Temperature: set the cabin to 23°C at least ten minutes before boarding, or to the client's stated preference. Hold 23°C during the ride; change it only when the client asks."],
    ["音楽、ラジオ、ナビの音声は切る。音を出すのはお客さまが求めたときだけ。", "Music, radio and satnav voice off. Sound only when the client asks for it."],
    ["乗務員の私物（飲み物、袋、書類、充電器）はお客さまから見えない場所に。前席の上にも置かない。", "The driver's personal items (drinks, bags, papers, chargers) out of the client's sight, not even on the front seat."],
    ["清掃は乗務のたびに行い、付録Bのチェックリストで確認する。", "Clean before every job and tick Appendix B."],
  ],
  notes: [["換気の「15分ごと」は、待機中にスマートフォンを見て時間を忘れる乗務員のための具体的な数字です。タイマーを使わせてください。", "'Every 15 minutes' is a concrete number for drivers who lose track of time on their phones while waiting. Have them use a timer."], ["23度は、お客さまの事務所から実際に指定された数字です（付録D、規則4）。", "23°C is a figure actually specified by a client's office (Appendix D, rule 4)."], ["温度計を車内に置き、エアコンの表示と実際の温度の差を見せる。", "Put a thermometer in the cabin and show the gap between the display and the real temperature."]],
  exercise: ["3日目の午前に、受講者が自分の車両を付録Bどおりに準備し、講師が指で窓ガラスとシートの隙間を確認する。", "On the morning of day 3 each trainee prepares their vehicle to Appendix B; the instructor checks glass and seat gaps by hand."],
  mistakes: [["芳香剤で「良い香り」にしようとする。目標は香りではなく無臭。", "Using an air freshener to make it 'smell nice'. The target is no smell, not a nice smell."], ["エンジンをかけてすぐ出発し、乗車時に車内が暑い・寒い。", "Starting the engine and leaving at once, so the cabin is hot or cold when the client boards."]] },

{ n: 5, h: ["ミニバーとアメニティ", "Minibar and amenities"],
  goals: [["標準の備品を、正しい場所に、正しい状態で用意できる。", "Stock the standard amenities in the right place and condition."]],
  rules: [
    ["標準ミニバー：水（常温と冷たいもの、炭酸なし）、お茶とコーヒーの缶またはペットボトル、ソフトドリンク、チョコレートとキャンディ、オレンジの香りのおしぼり（冷たいもの）。", "Standard minibar: still water (room temperature and chilled), canned or bottled tea and coffee, soft drinks, chocolates and candies, orange-scented refreshing towels (chilled)."],
    ["アメニティ：ティッシュ、ウェットティッシュ、充電ケーブル（USB-C と Lightning）、傘2本、ブランケット、ミント、スマートフォン用スタンド、変換プラグ、救急セット、ごみ袋。", "Amenities: tissues, wet wipes, charging cables (USB-C and Lightning), two umbrellas, a blanket, mints, a phone stand, a travel adaptor, a first-aid kit, a rubbish bag."],
    ["飲み物は未開封で、ラベルを前に向けてそろえる。使用期限を乗務ごとに確認する。", "Drinks unopened, labels facing forward, lined up. Check use-by dates before every job."],
    ["置き場所はお客さまが手を伸ばせば届く場所。乗車後に一度だけ案内する：「お水と充電ケーブルをご用意しています。ご自由にどうぞ。」", "Within the client's reach. Mention once after boarding: 'There is water and a charging cable here, please help yourself.'"],
    ["おしぼりは乗車時に差し出す。夏は冷たく、冬は温かく。", "Offer the towel on boarding: chilled in summer, warm in winter."],
    ["乗務ごとに補充し、使われたものは次のお客さまの前に必ず入れ替える。", "Restock after every job; anything used is replaced before the next client."],
  ],
  notes: [["見本一式を机に並べ、受講者に「正しい並べ方」をやらせる。写真を撮らせて営業所で再現させる。", "Lay the full sample kit on a table and have trainees arrange it correctly. Let them photograph it to reproduce at the depot."], ["お茶とコーヒーは缶やペットボトルの日本製品でよいが、熱い飲み物は火傷の危険があるので車内では出さない。", "Canned or bottled Japanese tea and coffee are fine; never serve hot drinks in the car because of scalding risk."]],
  exercise: ["5分で車両のミニバーを一から準備する。講師がストップウォッチで計る。", "Set up a vehicle minibar from scratch in five minutes, timed by the instructor."],
  mistakes: [["飲み物をトランクに置いている。手の届く場所でなければ意味がない。", "Keeping drinks in the boot. Out of reach, they do not exist."]] },

{ n: 6, h: ["ネームボード", "The name board"],
  goals: [["空港やホテルで、お客さまを守りながら正しく出迎えられる。", "Greet correctly at airports and hotels while protecting the client."]],
  rules: [
    ["ネームボードは白地に黒の太い文字、A4、印刷。手書きや汚れたものは不可。会社名またはブランドのロゴは小さく。", "White board, bold black printed letters, A4. No handwriting, no marks. Company or brand logo small."],
    ["通常のお客さま：Mr. / Ms. + 姓。フルネームは書かない。", "Normal clients: Mr. or Ms. plus surname. Never the full name."],
    ["警護が必要なお客さま、有名人：本名を書かない。秘書と事前に決めた仮の名前や合図を使う。本名を掲げると居場所を知らせることになる。", "Clients with security, public figures: never the real name. Use a code name or signal agreed with the assistant. A real name reveals where they are."],
    ["持ち方：胸の高さ、両手、まっすぐ。携帯電話を見ながら持たない。", "Hold it at chest height, with both hands, straight. Never while looking at a phone."],
    ["立ち位置：到着口の出口が見え、人の流れを妨げない場所。出口の正面で大声を出さない。", "Stand where the exit is visible without blocking the flow. Never call out in front of the exit."],
    ["到着の30分前には待機し、便名で遅延を確認して配車担当に報告する。", "In position 30 minutes before arrival; check the flight for delays and report to dispatch."],
  ],
  notes: [["見本を2枚見せる：正しいもの（Mr. Smith）と、やってはいけないもの（フルネームと会社名を大きく）。", "Show two samples: a correct one (Mr. Smith) and a wrong one (full name and company in large letters)."]],
  exercise: ["受講者が、与えられた3人のお客さまのプロフィールから、それぞれのネームボードの文面を決める。", "From three client profiles, trainees decide what each name board should say."],
  mistakes: [["フルネームと到着便名を書いて、誰でも読める状態にする。", "Writing the full name and flight number for anyone to read."]] },

{ n: 7, h: ["行程の準備", "Preparing the itinerary"],
  goals: [["運行計画を読み、乗務前に行程を完全に準備できる。", "Read the operating plan and prepare the itinerary completely before the job."]],
  rules: [
    ["行程表（運行計画）を前日までに受け取り、日時、場所、同乗者、言語、特別な指示を確認する。不明点は配車担当に前日までに聞く。", "Receive the itinerary the day before and check times, places, companions, language and special instructions. Ask dispatch about anything unclear, the day before."],
    ["乗車地点と降車地点を事前に確認する。初めての場所は、可能なら下見をする。少なくとも地図で入口、車寄せ、停車位置を確認する。", "Check pickup and drop-off points in advance. Visit new places if possible; at the least, check entrances, forecourts and stopping points on the map."],
    ["主要ルートと代替ルートを用意する。当日の朝に交通情報と天気を確認する。", "Prepare a main route and an alternative. Check traffic and weather on the morning of the job."],
    ["余裕時間：出迎えは30分前に到着、移動は所要時間の20%増しで見積もる。", "Buffers: arrive 30 minutes before a pickup; estimate journeys at 20% more than the usual time."],
    ["待機場所と駐車場を事前に決める。正面玄関に長く停め続けない。", "Decide waiting spots and parking in advance. Never sit for long at a main entrance."],
    ["連絡先一覧（配車担当、秘書、警護責任者）を紙でも持つ。電池切れは言い訳にならない。", "Carry the contact sheet (dispatch, assistant, security lead) on paper as well. A dead battery is no excuse."],
    ["乗務中の行程の変更は、配車担当に連絡して了解を得てから動く。", "Changes during the job: contact dispatch and get approval before acting."],
  ],
  notes: [["ここで「乗務員は会社の指示で動く」ことを明確に教える。請負と派遣の法的な違いは受講者には不要だが、「秘書から直接言われても、まず配車担当」の習慣は試験で問う。", "Teach clearly here that the driver works under the company's instructions. Trainees do not need the legal theory; the habit 'even if the assistant tells me directly, dispatch first' is tested."]],
  exercise: ["実在のホテルと空港を使った1日の行程を渡し、受講者が余裕時間、代替ルート、待機場所を書き込む。", "Hand out a real one-day itinerary with a hotel and an airport; trainees add buffers, alternative routes and waiting spots."],
  mistakes: [["ナビに任せて代替ルートを持たない。渋滞で止まった瞬間に選択肢がなくなる。", "Relying on the satnav with no alternative. The moment traffic stops, there are no options."]] },

{ n: 8, h: ["出迎え、ドア、席次、荷物、雨の日", "Greeting, doors, seating, luggage, rain"],
  goals: [["出迎えから乗車まで、安全で美しい一連の動作ができる。", "Perform the sequence from greeting to boarding safely and gracefully."], ["雨の日と買い物のお客さまへの対応ができる。", "Handle rain and a client with shopping."]],
  rules: [
    ["最初のひとこと：名乗る、歓迎する、荷物と車への案内。それだけで十分。", "The first words: introduce yourself, welcome them, guide them to luggage and car. That is enough."],
    ["ドアは完全に停車し、後方と周囲の安全を確認してから外に回って開ける。手を縁に添え、頭上に注意を促す。閉めるときは手足と服を確認し、静かに最後まで。", "Open the door only when fully stopped and after checking behind and around; walk round, hand on the frame, warn about the roof edge. Close gently and fully after checking hands, feet and clothing."],
    ["席は事前に確認する。分からなければ手のひらで後部座席を示し、お客さまに選んでいただく。", "Confirm seating in advance. If unknown, gesture to the rear seats and let the client choose."],
    ["荷物は乗務員が積み下ろしする。貴重品のバッグは「お手元に置かれますか」と聞く。", "The driver loads and unloads. Ask whether the client wants to keep a bag of valuables with them."],
    ["買い物の袋：お客さまに持たせない。「お持ちします」と言って受け取り、トランクか後部座席の指定の場所に、袋が倒れないように置く。壊れ物は手元に置くか聞く。", "Shopping bags: never let the client carry them. Say 'Let me take those', load them in the boot or where the client prefers so they cannot tip over, and ask whether fragile items should stay with the client."],
    ["雨の日：お客さまが建物から出る前に傘を開いて待つ。傘はお客さまの上に、乗務員は濡れても構わない。車まで、または建物の屋根まで、お客さまの横について歩く。ドアを開けてから傘をたたむ。降車時も同じ。", "Rain: have the umbrella open before the client leaves the building. The umbrella covers the client; the driver may get wet. Walk beside the client to the car, or to the next cover. Open the door first, then close the umbrella. Same on arrival."],
    ["傘は黒の大きいものを2本。1本はお客さま用、1本は同乗者用。", "Two large black umbrellas: one for the client, one for a companion."],
    ["降車：到着の1分前に「あと1分ほどで到着します」と伝え、停車後に外に回ってドアを開ける。忘れ物を確認する。", "Drop-off: announce 'We will arrive in one minute', open the door after stopping, check for items left behind."],
  ],
  notes: [["3日目の最初のシナリオはこの章です。雨のシナリオは、講師がじょうろやホースで実際に水をかけてもよいくらい、体で覚えさせてください。", "This chapter is the first scenario on day 3. For the rain scenario, make them do it for real; a watering can or hose is not excessive."], ["傘の角度（お客さまの肩が濡れない角度、乗務員側に傾ける）を実演する。", "Demonstrate the umbrella angle: tilted towards the driver so the client's shoulders stay dry."]],
  exercise: ["駐車場で、出迎えから乗車、降車までを1人ずつ行う。ほかの受講者が付録Aで採点する。", "In the car park, each trainee performs greeting to boarding to drop-off; the others score with Appendix A."],
  mistakes: [["自分が濡れないように傘を持つ。", "Holding the umbrella so the driver stays dry."], ["お客さまが袋を持ったまま乗車するのを見ている。", "Watching the client board with their own shopping bags."]] },

{ n: 9, h: ["車内での振る舞い：話しかけない", "Conduct in the car: do not initiate"],
  goals: [["沈黙がサービスであることを理解し、実行できる。", "Understand and practise silence as a service."]],
  rules: [
    ["お客さまから話しかけられない限り、乗務員から会話を始めない。雑談、身の上話、不要な質問は禁止。", "Never start a conversation unless the client does. No small talk, personal stories or unnecessary questions."],
    ["お客さまが話しかけてきたら、丁寧に、短く、プロとして答える。個人的な質問はしない。意見や助言は、はっきり求められたときだけ。", "If the client starts a conversation, answer politely, briefly and professionally. No personal questions. Opinions and advice only when clearly asked."],
    ["お客さまの電話、会議、予定、機嫌、私的な事柄について一切コメントしない。", "Never comment on the client's calls, meetings, schedule, mood or private matters."],
    ["乗務員から伝えてよいのは、安全にかかわること、到着の予告、予定の変更、時間が変わる渋滞だけ。結論と時刻を先に、一文で。", "The driver may only speak about safety, the arrival announcement, changes of plan and traffic that changes the timing. Conclusion and time first, in one sentence."],
    ["お客さまが電話や作業中は話しかけない。必要なら到着時に伝える。", "Never interrupt a call or work. Tell them at arrival if needed."],
    ["運転中に振り返らない。携帯電話はマナーモードで触らない。食べない、ガムを噛まない。", "Do not turn round to the client. Phone on silent and untouched. No eating, no gum."],
    ["運転は滑らかに。急ブレーキ、急加速、急な車線変更、速度超過はしない。お客さまが書類を読めるくらいの運転。", "Drive smoothly: no sudden braking, acceleration, lane changes or speeding. Smooth enough for the client to read."],
    ["プロとしての距離を保つ。親しくなろうとしない。", "Keep a professional distance. Do not try to build rapport."],
  ],
  notes: [["日本のタクシー乗務員の多くは「無言は失礼」と教わっています。ここで逆の基準を明確に示してください。付録Dの規則2、9、12を読み上げるのが効果的です。", "Many Japanese taxi drivers were taught that silence is rude. State the opposite standard clearly here; reading rules 2, 9 and 12 of Appendix D aloud works well."], ["「一文で伝える」練習：渋滞、ルート変更、到着予告の3つを、それぞれ15語以内で言わせる。", "Practise 'one sentence': traffic, route change and arrival announcement, each in 15 words or fewer."]],
  exercise: ["講師がお客さま役で30分の模擬乗車（椅子で可）。講師は電話をし、書類を読み、途中で一度だけ質問する。受講者が話してよい場面と悪い場面を記録する。", "A 30-minute mock ride with the instructor as client (chairs will do). The instructor takes a call, reads papers and asks one question. Note when the trainee should and should not speak."],
  mistakes: [["沈黙に耐えられず、天気や観光の話を始める。", "Unable to bear silence, starting on the weather or sightseeing."]] },

{ n: 10, h: ["守秘とSNS", "Confidentiality and social media"],
  goals: [["守秘の範囲と、SNSで何が危険かを説明できる。", "Explain what confidentiality covers and what is dangerous on social media."]],
  rules: [
    ["乗務中に見聞きしたことはすべて秘密：名前、行き先、時間、同乗者、会話、電話、車内の書類。", "Everything seen or heard on duty is confidential: names, destinations, times, companions, conversations, calls, documents in the car."],
    ["誰にも話さない：家族、友人、同僚、ほかのお客さま、SNS。名前を伏せても不可。", "Tell no one: family, friends, colleagues, other clients, social media. Leaving out the name is not enough."],
    ["写真、動画、録音は一切禁止。お客さま、車内、ホテルの前の車、行き先の建物も。投稿は仕事の後でも禁止。", "No photos, videos or recordings of any kind: not the client, the cabin, the car outside the hotel or the destination. No posting, even afterwards."],
    ["位置情報、ストーリーの位置タグ、乗務中のライブ配信は禁止。", "No location data, location tags or live streaming on duty."],
    ["有名人にサインや写真を求めない。お客さまから頼まれて撮る場合は、お客さまの端末でのみ。", "Never ask a famous client for an autograph or selfie. If asked to take a photo, only on the client's device."],
    ["車内の書類は読まない。忘れ物は中身を見ずに会社の手順で保管し、すぐ連絡する。", "Never read documents in the car. Keep lost items unopened under company procedure and report at once."],
    ["報道関係者などに聞かれたら「お答えできません」とだけ言い、会社に報告する。守秘義務は乗務の後も続く。", "If the press or anyone asks, say only 'I cannot comment' and report to the company. The duty continues after the job."],
  ],
  notes: [["「無害に見える投稿」の実例を3つ用意する（ホテルの車寄せの写真、「今日は有名人を乗せた」、高級車の写真と時刻）。", "Prepare three examples of posts that look harmless (a hotel forecourt photo, 'drove someone famous today', a luxury car with a timestamp)."]],
  exercise: ["3つの投稿例を見せ、受講者がそれぞれ「誰がお客さまを特定できるか」を説明する。", "Show the three posts; trainees explain who could identify the client from each."],
  mistakes: [["「名前を書かなければ大丈夫」。車と場所と時刻で特定できる。", "'It's fine without the name.' Car, place and time identify the client."]] },

{ n: 11, h: ["秘書、警護、ファミリーオフィスとの連携", "Working with assistants, security and family offices"],
  goals: [["誰の指示に従い、誰に報告するかが分かる。", "Know whose instructions to follow and to whom to report."]],
  rules: [
    ["乗務員は所属する会社の指示で乗務する。行程の変更は配車担当を通して確認する。", "The driver works under the company's instructions. Itinerary changes go through dispatch."],
    ["秘書：事前の情報は会社を通して受け取る。乗務中の小さな連絡（出発時刻など）は直接受けてよい。", "Assistants: advance information comes through the company; small updates during the job, such as departure times, may come directly."],
    ["警護：ルート、停車位置、乗降の順番は警護責任者が決める。自分の判断でルートを変えない。", "Security: the security lead decides routes, stopping points and the order of getting in and out. Never change route on your own."],
    ["ファミリーオフィス：お子さまの送迎や習い事など細かい指示がある。メモを取り、復唱して確認する。", "Family offices: detailed instructions such as school runs and activities. Take notes and repeat back."],
    ["乗務の始まりと終わり、遅れ、予定外のことは、短く正確に会社に報告する。", "Report start, end, delays and anything unexpected to the company, briefly and precisely."],
  ],
  notes: [["警護付きの移動は3日目のシナリオ3で実技にします。ここでは「警護より先に降りてドアを開けない」など、順番を板書してください。", "Security rides are practised in scenario 3 on day 3. Here, write the order on the board, such as never getting out before security to open the door."]],
  exercise: ["「秘書から乗車中に行き先の追加を頼まれた」場面を演じ、受講者が正しい手順（配車担当に電話して了解）を実行する。", "Act out the assistant adding a destination mid-ride; the trainee performs the correct steps (call dispatch for approval)."],
  mistakes: [["良かれと思って秘書の指示にその場で従い、会社に報告しない。", "Following the assistant's instruction on the spot, meaning well, and not telling the company."]] },

{ n: 12, h: ["想定外の事態", "The unexpected"],
  goals: [["慌てずに、安全、連絡、代案の順に動ける。", "Act calmly: safety, communication, then alternatives."]],
  rules: [
    ["遅れ：分かった時点ですぐ、新しい到着時刻とともに秘書と会社に連絡する。理由は短く、謝罪を添える。", "Delays: as soon as known, tell the assistant and the company with a new arrival time. Reason short, with an apology."],
    ["体調不良：安全な場所に停車し、意識と呼吸を確認。必要なら119番、そして秘書と会社に連絡。", "Illness: stop safely, check consciousness and breathing; call 119 if needed, then the assistant and the company."],
    ["事故：お客さまの安全を確保し、110番と会社に連絡。次の移動手段は会社と調整する。", "Accidents: secure the client, call 110 and the company. Onward travel is arranged through the company."],
    ["車両の不具合：安全な場所に停車し、会社に連絡して代車を手配する。お客さまには短く状況と次の行動を伝える。", "Vehicle fault: stop safely, call the company for a replacement. Tell the client briefly what is happening and what happens next."],
    ["予定の変更：配車担当の了解を得てから動く。", "Changes of plan: get dispatch approval before acting."],
    ["忘れ物：中身を見ずに保管し、会社と秘書にすぐ連絡する。", "Lost items: keep unopened, tell the company and the assistant at once."],
    ["どの場合も、落ち着いて、お客さまに短く明確に伝え、実際的な解決策を示し、余計なストレスを与えない。", "In every case: stay calm, inform the client briefly and clearly, offer a practical solution, add no stress."],
  ],
  notes: [["緊急連絡先（110、119、118）と、会社の緊急番号を暗記させる。", "Have them memorise the emergency numbers (110, 119, 118) and the company's emergency line."]],
  exercise: ["カードを引いて（渋滞、体調不良、パンク、行き先追加）、30秒以内に最初の3つの行動を言う。", "Draw a card (traffic, illness, puncture, added destination) and state the first three actions within 30 seconds."],
  mistakes: [["遅れが確定してから連絡する。分かった時点で連絡。", "Calling once the delay is certain. Call the moment it becomes likely."]] },
];

export const DAY2 = {
  h: ["2日目　接客の外国語", "Day 2 · Service language"],
  intro: ["2日目の目標は流暢さではなく、場面の9割を60のフレーズで、はっきり伝わる発音でこなすことです。教材は受講者用の第12〜19章と同じです。ここでは教え方と採点の基準を示します。", "The goal of day 2 is not fluency: it is handling nine situations in ten with 60 phrases, pronounced clearly. The material is the same as trainees' chapters 12 to 19. This section gives the method and the marking criteria."],
  method: [
    ["各フレーズは「講師が言う、全員で繰り返す、1人ずつ言う」の3回。1場面10分。", "Each phrase three times: instructor says it, all repeat, each trainee says it alone. Ten minutes per situation."],
    ["発音の練習は第14章の10語から。語尾の母音を付けない、強く言う場所を守る。", "Pronunciation starts with the ten words of chapter 14: no vowel on the end, stress in the right place."],
    ["ロールプレイは講師がお客さま役。台本どおり1回、台本なしで1回、途中で予定外の質問を1つ入れる。", "Role plays with the instructor as client: once with the script, once without, with one unexpected question."],
    ["翻訳アプリは実際に使わせる。機密を入力しない練習（名前や行き先を伏せる言い換え）を含める。", "Have them actually use a translation app, including rephrasing so that names and destinations are never typed."],
    ["メッセージは3種類を実際に書かせ、講師が添削する。", "Have them write the three message types for real and correct them."],
  ],
  oral: { h: ["口頭試験の採点基準（100点）", "Oral exam marking (100 points)"], rows: [
    ["出迎えと案内（第13章 場面1〜2）", "Greeting and guiding (ch. 13, situations 1 to 2)", "25"],
    ["移動中の案内と確認（場面3〜5）", "Information and confirmation during the ride (situations 3 to 5)", "25"],
    ["お詫びと緊急時（場面6）", "Apologies and emergencies (situation 6)", "20"],
    ["発音と聞き取りやすさ", "Pronunciation and clarity", "20"],
    ["予定外の質問への対応（聞き返す、書いてもらう、画面で確認）", "Handling an unexpected question (ask again, ask them to write, confirm on screen)", "10"],
  ], note: ["合格は70点以上。文法の誤りは、意味が伝われば減点しない。伝わらない発音と、沈黙してしまうことを減点する。", "Pass mark 70. Grammar mistakes are not penalised if the meaning gets through; unclear pronunciation and freezing into silence are."] },
};

export const DAY3 = {
  h: ["3日目　車両での実地練習と試験", "Day 3 · In-car practice and exams"],
  intro: ["講師がお客さま役を務めます。各シナリオは、準備（車両、身だしなみ）、出迎え、乗車、走行、降車、報告までを通して行います。講師は意図的に予定外の出来事を起こします。", "The instructor plays the client. Each scenario runs from preparation (vehicle, grooming) through greeting, boarding, the ride, drop-off and the report. The instructor deliberately introduces something unexpected."],
  scenarios: [
    { h: ["シナリオ1　空港の出迎え", "Scenario 1 · Airport pickup"], text: ["ネームボードで出迎え、荷物3個、ホテルまで40分。走行中、講師は電話をし、途中で「到着は何時」と1回だけ聞く。見るポイント：ネームボードの文面と持ち方、最初のひとこと、荷物の扱い、ドア、温度23度、ミニバーの案内を一度だけ、話しかけないこと、到着の1分前の予告。", "Greeting with the name board, three bags, 40 minutes to the hotel. During the ride the instructor takes a call and asks once 'What time will we arrive?'. Watch: name board wording and hold, first words, luggage, doors, 23°C, the minibar mentioned once, no initiating, the one-minute announcement."] },
    { h: ["シナリオ2　雨の日のホテル送迎と買い物", "Scenario 2 · Hotel pickup in the rain, with shopping"], text: ["ホテルの車寄せで雨（実際に水をかけてよい）。講師は買い物袋を4つ持って出てくる。見るポイント：傘を先に開いて待つ、傘の角度、袋を受け取る、壊れ物を聞く、袋が倒れない置き方、ドアを開けてから傘をたたむ、降車時の同じ動作。", "Rain at the hotel forecourt (real water is fine). The instructor comes out with four shopping bags. Watch: umbrella open in advance, umbrella angle, taking the bags, asking about fragile items, loading so nothing tips, door first then umbrella down, the same on arrival."] },
    { h: ["シナリオ3　警護付きの移動と行程の変更", "Scenario 3 · A security ride and a change of plan"], text: ["受講者の1人が警護役。走行中に「秘書役」から電話で行き先の追加。見るポイント：乗降の順番、ルートを勝手に変えない、追加の行き先は配車担当（講師の携帯）に電話して了解を得る、待機場所の選び方。", "One trainee plays security. Mid-ride, the 'assistant' calls to add a destination. Watch: the order of getting in and out, no unilateral route change, calling dispatch (the instructor's phone) for approval, the choice of waiting spot."] },
    { h: ["シナリオ4　緊急時", "Scenario 4 · Emergencies"], text: ["講師が走行中に「気分が悪い」と言う。別の回では渋滞で20分遅れる設定。見るポイント：安全な停車、確認、119番の判断、秘書と会社への連絡、お客さまへの短い説明と次の行動、英語のフレーズ。", "The instructor says 'I don't feel well' during the ride; in another run, traffic causes a 20-minute delay. Watch: safe stop, checks, the decision to call 119, informing the assistant and the company, a short explanation to the client with the next step, the English phrases."] },
  ],
  practical: { h: ["実地試験の採点基準（100点）", "Practical exam marking (100 points)"], rows: [
    ["車両の準備：清潔、無臭、換気、23度、備品、私物なし", "Vehicle preparation: clean, scent-free, aired, 23°C, amenities, no personal items", "20"],
    ["身だしなみと無臭", "Grooming and no scent", "10"],
    ["出迎え、ネームボード、最初のひとこと", "Greeting, name board, first words", "10"],
    ["ドア、席次、荷物、買い物袋、傘", "Doors, seating, luggage, shopping bags, umbrella", "20"],
    ["運転の滑らかさと安全", "Smooth, safe driving", "10"],
    ["車内での振る舞い：話しかけない、一文で伝える、電話に触らない", "Conduct: no initiating, one-sentence updates, phone untouched", "15"],
    ["予定外の事態への対応と、会社への連絡", "Handling the unexpected and contacting the company", "15"],
  ], note: ["合格は70点以上。ただし次のいずれかがあれば点数に関係なく不合格：安全確認なしでドアを開ける、乗務中に携帯電話を操作する、お客さまの情報を口にする、香水やたばこのにおい。", "Pass mark 70. Regardless of score, any of the following fails: opening a door without a safety check, using the phone on duty, disclosing client information, a smell of perfume or tobacco."] },
};

export const EXAMS = {
  h: ["試験、修了証、認証", "Exams, attestation and certification"],
  items: [
    ["筆記試験：HDJ Academy のオンラインで、20問（25問の問題集から無作為）、30分、70点以上で合格。選択肢の順番は受験のたびに変わる。受験は2回まで含まれ、60日以内の再受験は無料。", "Written exam: online in the HDJ Academy, 20 questions drawn from a bank of 25, 30 minutes, pass mark 70, answer order shuffled each attempt. Two attempts included; a retake within 60 days is free."],
    ["口頭試験：3日目、1人10分、講師がお客さま役。採点は2日目の基準。", "Oral exam: day 3, ten minutes per trainee, instructor as client, marked to the day 2 criteria."],
    ["実地試験：3日目、1人20〜25分、受講者の車両で。採点は3日目の基準。", "Practical exam: day 3, 20 to 25 minutes per trainee, in the trainee's vehicle, marked to the day 3 criteria."],
    ["修了証（Attestation of Completion）：全日程を受講した全員に。期限なし。", "Attestation of Completion: for everyone who attends every day. No expiry."],
    ["認証書（VVIP Service Certificate）：3つの試験すべてに合格した乗務員にのみ。有効期間2年、1日の更新研修で更新。番号とQRコードで hiredriverjapan.com/verify から確認できる。", "VVIP Service Certificate: only for drivers who pass all three exams. Valid two years, renewed with a one-day refresher. Verifiable by number and QR code at hiredriverjapan.com/verify."],
    ["講師は採点表を研修当日中に HIRE driver japan に送る。証書の発行は本部が行う。", "The instructor sends the marking sheets to HIRE driver japan on the day. Certificates are issued by head office."],
  ],
};

export const APPENDIX_A = { h: ["付録A　乗務前チェックリスト（乗務員本人）", "Appendix A · Pre-departure checklist (the driver)"], items: [
  ["睡眠と体調は良い", "Rested and well"], ["歯を磨いた、ミント、口臭なし", "Teeth brushed, mint, no bad breath"], ["手を洗った、爪は短い", "Hands washed, nails short"], ["香水、整髪料、柔軟剤の香りなし", "No perfume, scented hair product or fabric softener"], ["たばこのにおいなし（乗務前は吸わない）", "No tobacco smell (no smoking before the job)"], ["においの強い食事をとっていない", "No strong-smelling food"], ["スーツにしわと汚れなし、シャツは白、靴は磨いた", "Suit uncreased and clean, white shirt, shoes polished"], ["髪とひげを整えた", "Hair and beard neat"], ["携帯電話はマナーモード、充電100%", "Phone on silent, fully charged"], ["免許証、行程表、連絡先一覧（紙）", "Licence, itinerary, contact sheet (paper)"], ["ネームボード（文面を確認）", "Name board (wording checked)"], ["傘2本、予備のシャツ、ハンカチ2枚", "Two umbrellas, spare shirt, two handkerchiefs"],
] };
export const APPENDIX_B = { h: ["付録B　車両の準備チェックリスト", "Appendix B · Vehicle preparation checklist"], groups: [
  { h: ["点検", "Checks"], items: [["燃料または充電は十分", "Fuel or charge sufficient"], ["タイヤ、灯火、ワイパー、ウォッシャー液", "Tyres, lights, wipers, washer fluid"], ["エアコンの動作、23度に設定", "Air conditioning working, set to 23°C"]] },
  { h: ["外装", "Exterior"], items: [["洗車済み、ホイール、窓ガラスの汚れなし", "Washed; wheels and glass clean"], ["ナンバープレートがきれい", "Number plates clean"]] },
  { h: ["内装", "Interior"], items: [["シート、足元、ドアポケット、トランクを清掃", "Seats, footwells, door pockets and boot cleaned"], ["窓の内側と鏡に指紋なし", "No fingerprints on inside glass or mirrors"], ["髪の毛、砂、ごみなし", "No hair, grit or rubbish"], ["無臭（芳香剤なし、食べ物なし、たばこなし）", "Scent-free (no freshener, food or tobacco)"], ["換気した（待機中は15分ごと）", "Aired (every 15 minutes while waiting)"], ["乗務員の私物は見えない場所", "Driver's personal items out of sight"], ["音楽、ラジオ、ナビの音声は切った", "Music, radio and satnav voice off"]] },
  { h: ["出発前", "Before leaving"], items: [["ミニバーとアメニティを付録Cどおりに補充", "Minibar and amenities restocked to Appendix C"], ["行程、代替ルート、待機場所を確認", "Itinerary, alternative route and waiting spot checked"], ["交通情報と天気を確認", "Traffic and weather checked"], ["出迎えの30分前に到着する出発時刻", "Departure time that gets you there 30 minutes early"]] },
] };
export const APPENDIX_C = { h: ["付録C　ミニバーとアメニティの一覧", "Appendix C · Minibar and amenity list"], groups: [
  { h: ["飲み物（未開封、ラベルを前に）", "Drinks (unopened, labels forward)"], items: [["水　常温2本、冷たいもの2本（炭酸なし）", "Still water: two at room temperature, two chilled"], ["お茶（缶またはペットボトル）2本", "Tea, canned or bottled: two"], ["コーヒー（缶またはペットボトル）2本", "Coffee, canned or bottled: two"], ["ソフトドリンク2本", "Soft drinks: two"]] },
  { h: ["お菓子", "Sweets"], items: [["チョコレート（個包装）", "Chocolates, individually wrapped"], ["キャンディ（個包装）", "Candies, individually wrapped"], ["ミント", "Mints"]] },
  { h: ["おしぼり", "Towels"], items: [["オレンジの香りのおしぼり（夏は冷たく、冬は温かく）", "Orange-scented refreshing towels (chilled in summer, warm in winter)"]] },
  { h: ["備品", "Amenities"], items: [["ティッシュ、ウェットティッシュ", "Tissues, wet wipes"], ["充電ケーブル：USB-C、Lightning", "Charging cables: USB-C and Lightning"], ["スマートフォン用スタンド、変換プラグ", "Phone stand, travel adaptor"], ["傘2本（黒、大きいもの）", "Two large black umbrellas"], ["ブランケット", "Blanket"], ["救急セット", "First-aid kit"], ["ごみ袋（見えない場所）", "Rubbish bag (out of sight)"]] },
  { h: ["管理", "Management"], items: [["使用期限を乗務ごとに確認", "Check use-by dates before every job"], ["使われたものは次のお客さまの前に入れ替え", "Replace anything used before the next client"]] },
] };

// Appendice D: regole scritte dall'ufficio di un CEO del Golfo, adattate e anonime
export const APPENDIX_D = {
  h: ["付録D　お客さまが実際に求める基準（ある中東の経営者の事務所が作成した乗務員ガイドライン、2026年）", "Appendix D · What a client actually asks for (driver guidelines issued by a Gulf CEO's office, 2026)"],
  intro: ["以下は、海外の経営者の事務所が自社の運転手のために作成した規則を、本人の許可の範囲で、名前を伏せて要約したものです。HIRE driver japan の基準と一致していることを確認してください。", "The following summarises, anonymised and within the permission given, the rules written by an overseas executive's office for its own drivers. Note how closely they match the HIRE driver japan standard."],
  sections: [
    ["優先順位", "Priorities", ["安全、守秘、快適さ、プロとしての振る舞い。", "Safety, confidentiality, passenger comfort, professional conduct."]],
    ["会話", "Communication", ["必要がなければ会話を始めない。雑談、身の上話、不要な質問で邪魔をしない。質問されたら丁寧に短く答える。個人的な質問をしない。求められない限り意見や助言を言わない。電話、会議、予定、機嫌、私的な事柄についてコメントしない。", "Do not initiate conversation unless necessary. No small talk, personal stories or unnecessary questions. Answer direct questions politely and briefly. No personal questions. No opinions or advice unless asked. No comments on calls, meetings, schedule, mood or private matters."]],
    ["守秘", "Confidentiality", ["見聞きしたことはすべて厳秘。ルート、会議、会話、予定を誰にも話さない。写真、動画、録音は禁止。SNSに出さない。どこにいた、どこへ行く、誰と会ったかを決して明かさない。", "Everything seen, heard or learned is strictly confidential. Never discuss routes, meetings, conversations or schedule. No photos, videos or recordings. Nothing on social media. Never disclose where the passenger was, is going or whom they met."]],
    ["車両", "The vehicle", ["内外とも清潔、整備良好、燃料十分、私物なし、窓と鏡が清潔、空調は22〜23度で正常に作動。車内にごみ、ほこり、強いにおい、不要な私物、大きな音楽、気が散る物を置かない。", "Clean inside and out, in excellent condition, fuelled, free of clutter, clean windows and mirrors, climate control working at 22 to 23°C. No trash, dust, strong odours, personal items, loud music or distracting objects."]],
    ["におい", "Smell", ["車内は清潔で控えめな、新鮮で中立的なにおいに。強い芳香剤、強い香水、たばこ、食べ物のにおいは不可。可能な限り乗務前に換気する。", "A clean, subtle, fresh and neutral smell. No strong fresheners, perfume, tobacco or food. Air the vehicle before the trip whenever possible."]],
    ["身だしなみ", "Appearance", ["清潔で整った、プロらしい服装と靴。カジュアル、しわ、汚れ、強い香水は不可。", "Neat, clean, professional clothing and shoes. No casual or sporty clothes, creases, stains or strong perfume."]],
    ["到着と出迎え", "Arrival and pickup", ["余裕をもって早めに到着し、乗車前に車両を完全に準備する。時間、場所、ルート、交通状況、最も安全で便利な乗車地点を事前に確認する。", "Arrive early with a buffer; the vehicle fully ready before the passenger enters. Confirm the time, place, route, traffic and the safest, most convenient pickup point beforehand."]],
    ["運転", "Driving", ["滑らかで、安全で、落ち着いた、予測できる運転。速さより安全。最速よりも最も快適なルート。急加速、急ブレーキ、乱暴な車線変更、速度超過、危険な操作は禁止。", "Smooth, safe, calm and predictable. Safety over speed; the most comfortable route, not only the fastest. No sudden acceleration, hard braking, aggressive lane changes, speeding or risky manoeuvres."]],
    ["乗車中", "During the ride", ["静かな車内。音楽は求められたときだけ。携帯電話はマナーモード、私用の通話は緊急時以外禁止。道路に集中し、不必要に振り返らない。食べない、ガムを噛まない。", "A calm, quiet cabin. Music only on request. Phone on silent, no personal calls except in an emergency. Eyes on the road; no turning round unnecessarily. No eating or chewing gum."]],
    ["快適さ", "Comfort", ["快適な温度、清潔な座席、滑らかな運転、とくに仕事中や電話中は静かな車内。水、ティッシュ、充電ケーブル、救急セットを用意する。", "A comfortable temperature, clean seats, smooth driving, and quiet especially when the passenger is working or on a call. Bottled water, tissues, charging cables and a first-aid kit available."]],
    ["喫煙と食事", "Smoking and food", ["車内での喫煙は厳禁。乗務直前も吸わない。においの強い食事を避ける。", "Smoking in the vehicle is strictly prohibited, and not immediately before a trip. Avoid strong-smelling food."]],
    ["距離", "Distance", ["丁寧で、敬意をもって、控えめに。親しくなりすぎない。個人的な関係を築こうとしない。", "Polite, respectful and discreet. Never over-familiar. Do not try to build a personal rapport."]],
    ["想定外の事態", "The unexpected", ["落ち着く、必要なら短く明確に伝える、実際的な解決策を示す、ストレスを増やさない、安全を最優先に。", "Stay calm, inform briefly and clearly if necessary, offer a practical solution, add no stress, put safety first."]],
    ["許されないこと", "Unacceptable", ["遅刻、口論、社内の話をする、運転中の携帯電話、乱暴な運転や違反、無礼やおしゃべり、個人的な質問、秘密の漏えい、車内の悪臭、不要な不快感。", "Being late, arguing, discussing internal company matters, phone use while driving, aggressive or illegal driving, rudeness or talkativeness, personal questions, disclosing information, bad smells, any unnecessary discomfort."]],
  ],
};

export const QUICKCARD = { h: ["講師用カード　譲れない10の規則", "Instructor's card · The ten non-negotiables"], items: [
  ["乗務員も車内も無臭。", "Driver and cabin scent-free."],
  ["車内で食べない、持ち込まない。乗務前にたばこと強いにおいの食事をとらない。", "No food in the car. No tobacco or strong food before the job."],
  ["お客さまがいない間は15分ごとに換気、乗車前に必ず一度。", "Air the cabin every 15 minutes while waiting, and once before boarding."],
  ["車内は23度、乗車の10分前までに。変えるのはお客さまが求めたときだけ。", "23°C, ten minutes before boarding. Change it only when asked."],
  ["お客さまから話しかけられない限り、話さない。", "Never speak first."],
  ["雨：傘を先に開き、お客さまを覆い、屋根まで付き添う。乗務員は濡れてよい。", "Rain: umbrella open first, over the client, escort to cover. The driver may get wet."],
  ["買い物袋はお客さまに持たせず、乗務員が受け取って積む。", "Never let the client carry shopping; take it and load it."],
  ["ネームボードは Mr. / Ms. + 姓。警護付きなら本名を出さない。", "Name board: Mr. or Ms. plus surname. With security, never the real name."],
  ["写真、投稿、話す：すべて禁止。見聞きしたことは一生の秘密。", "No photos, no posts, no talking. What you see and hear stays secret for life."],
  ["行程の変更は配車担当の了解を得てから。", "Changes of plan only with dispatch approval."],
] };

export { CHAPTERS };

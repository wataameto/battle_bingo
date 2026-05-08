import React, { useState, useEffect } from 'react';
import { Sparkles, RotateCcw, Trophy, Target, Wand2 } from 'lucide-react';

const BattleBingo = () => {
  const [playerBoard, setPlayerBoard] = useState(Array.from({ length: 5 }, () => Array(5).fill(0)));
  const [cpuBoard, setCpuBoard] = useState(Array.from({ length: 5 }, () => Array(5).fill(0)));
  const [selfMarks, setSelfMarks] = useState(new Set());
  const [opponentMarks, setOpponentMarks] = useState(new Set());
  const [usedNumbers, setUsedNumbers] = useState(new Set());
  const [currentTurn, setCurrentTurn] = useState('janken');
  const [gameStatus, setGameStatus] = useState('playing');
  const [jankenPlayerChoice, setJankenPlayerChoice] = useState(null);
  const [jankenCpuChoice, setJankenCpuChoice] = useState(null);
  const [turnHistory, setTurnHistory] = useState([]);
  const getRandomMessage = (type, number = null) => {
    const messages = {
      jankenStart: [
        'じゃんけん勝負～！負けたほうが先に選ぶってことで～！グーかチョキかパー、どれにしようかな～ふふふ～あ、ちなみにね、うち、じゃんけんずっと強いんよ～運がいいから～',
        'まずはじゃんけんで勝負～！負けたほうが先に選ぶってことで～！うち、本気よ～あ、そういえばね、うち、この前、海に行ったんだけど～すごく楽しかった～ふふふ～',
        'ふふふ、じゃんけん勝負だ～！負けたら先に選ぶってやつね～！さあ、どれにしようかな～あ、でもね、どれ選んでもうち、勝つんよ～女神の力よ～ふふふふ～',
        'よーし、じゃんけんポン！負けたほうが先よ～グー、チョキ、パーのどれ～うち、本気出しちゃう～ふふふ～あ、キミ、ジンクスとかある～？うちは別にない～いつでも勝つから～',
      ],
      jankenWin: [
        '🎉 あ、勝った～！ラッキー～！キミが先に選ぶのね～ふふふふ！うちの運、最高だね～この調子でビンゴも余裕～キミ、覚悟しといてね～あ、ちなみにじゃんけん得意なんよ～',
        '🎉 え、勝っちゃった～！運いいな～！さあさあ、キミが先に選んで～うち、準備万端で待ってるから～ふふふ！うち、勝つ気満々～あ、ちなみにうち、何やってもだいたい勝つ～',
        '🎉 わ、勝った～！ビギナーズラック～！キミ先ね～ふふふふ！キミ、頑張ってくれたまえ～うちはね、このまま全勝を目指しちゃう～うふふふ～あ、今日の運、最高～',
        '🎉 勝った～！うちの勝ちだ～！キミが先に選ぶ羽目に～ごめんね～ふふふ！いやー、気持ちいい～このテンションでビンゴも行っちゃおう～キミ、びびってる～あ、もうこれから勝利の道よ～',
      ],
      jankenLose: [
        '💔 あ、負けちゃった～…ショック…うち先に選ぶのか…悔しいな～でもね、ビンゴではね、うち、全力で来ちゃうからね～覚悟してね～この悔しさ、バネにするぞ～',
        '💔 え、負けた…あ、うちが先か…悔しい…頑張らなきゃ…うち、この悔しさをバネにしてビンゴで逆襲しちゃおう～ふふふ～キミなめんなよ～',
        '💔 あ、負けた…うちが先ね…まいったな～キミ強いな～でもビンゴは別よ～うち、キミに絶対に勝つんだからね～ふふふ～ビンゴは別よ～',
        '💔 ぎゃー負けた～！うちが先に選ぶ羽目に…あーもう悔しい～！でもね、ここからが勝負なのよ～ビンゴでは容赦しないんだからね～ふふふふ！キミ、震えて待ってろ～',
      ],
      jankenDraw: [
        'あいこだ～！もう一回～！キミ、今度は本気で来てくれるよね～うちも本気よ～ふふふ～キミ、震えて待ってろ～ふふふ～',
        'あ、同じだった～もう一回やっちゃおう～どっちが強いのか決着つけようぜ～今度こそうち、勝つぞ～ふふふ～',
        'あいこか～面白い～もう一回ね～うち、今度こそ勝つぞ～キミ、覚悟しときなさい～ふふふ～',
        'あいこで～～もう一回頑張ろう～キミ、覚悟はいい～ふふふ～うち、本気出すよ～ふふふふ～',
      ],
      start: [
        'さあさあ、ビンゴの時間ね～！張り切っていっちゃおう～！キミ、負けちゃダメよ～ふふふ！うち、いっぱい数字選んじゃって早くビンゴ作っちゃおう～テンション最高～あ、これから勝ったらお祝いしましょ～ふふふ～',
        '出番だ～！もう心の準備はいいのかな～？うち、いつでも準備万端だけど～！やっちゃいましょ～ビンゴゲーム～ふふふふ！キミ、びびってたら駄目よ～あ、ちなみにうちって、いつもこんなテンション～',
        'おまかせボタンで楽しちゃうのもありなんだけど、キミはどうするのかな～キミの選択ってやつが気になっちゃう～どっち選ぶのかな～ふふふ～あ、うちはもう全部見えてる～ふふふ～',
        '選択の時間よ～！うちと一緒にビンゴを成し遂げちゃいましょ～ふふふ！キミ、うちに負けないように頑張ってね～でも負けちゃうと思うけど～ふふふ～あ、楽しいのが一番よね～',
        'ドキドキ…選んでみましょ～！どっちが先に5個揃えるのかな～わくわくしちゃう～うち、めっちゃドキドキ～興奮で手が震えちゃう～あ、これって心臓に悪いんだけど、楽しいから～ふふふ～',
        'さあ、数字を選んじゃいましょ～ふふふ！ここからが本当の勝負よ～キミ、頑張ってくれるよね～期待してるから～ふふふふ～あ、でもうちが勝つ可能性99.9%～ふふふ～',
        'ビンゴゲーム開始～！さあ、どっちが勝つかな～あ、もう勝者は決まってる～うちだけど～ふふふ～あ、キミも楽しみましょ～これ、すごい楽しいゲームなんよ～',
        '選択の時間だね～さあさあ～あ、ちなみにね、うち、このゲーム、いっぱいやってるんだけど～絶対勝つ～ふふふ～今回もね～',
        'さあ、始まるね～ふふふ～うち、すごい気分いい～こういう時って、最高の運がやってくる～女神の祝福だ～ふふふふ～',
        'ビンゴ時間～！わくわく～あ、キミ、今日のキミの運気、どう～？うちはね、いつも最高～ふふふ～',
        'さあさあ、行くよ～！あ、ちなみにね、うち、朝からテンション上げてくるんよ～毎日～ふふふ～',
        '選択タイム～！キミ、頑張ってね～うち、応援してる～でも敵として～ふふふふ～',
        'ゲーム開始～！あ、キミ、運気ある～？あ、なくても大丈夫～うちが運持ってるから～ふふふ～',
        '数字を選びましょ～ふふふ！あ、うち、最近ハッピーなんよ～毎日ハッピー～ふふふ～',
        'さあ、勝負だ～！あ、でも楽しむのが一番ね～勝つのも楽しい～負けるのも楽しい～うちは楽しいことしか知らない～ふふふふ～',
        'ビンゴゲーム、スタート～！あ、キミ、ちょっと緊張してる～？かわいい～頑張ってね～ふふふ～',
        '行くよ～！あ、ちなみにね、うち、毎日新しい発見がある～今日は何かな～あ、ビンゴだ～ふふふ～',
        'さあ、選んじゃいましょ～！あ、この時間、すごい好き～ドキドキが止まらない～楽しい～ふふふふ～',
      ],
      draw: [
        '引き分けか…悔しいんだけど！うちだって全力だったのに～キミ、すごいじゃない～こういうキミって嫌いじゃないな～意外と強い～ふふふ～',
        'どっちも全力だったんだ…こんなの珍しい～キミ、なかなかやるじゃん～でも次は負けないんだからね～うち、本気出すよ～',
        'タイなんて、あり得ない悔しさ～！もう一回やろう～今度はうちが勝つ～！ぜったい勝つ～！キミ、覚悟しときなさい～ふふふ～',
        '引き分けなんて珍しい…むむむ、キミなかなかやるね～もう一回っ！うち、今度こそ本気よ～ふふふ～キミ、やっぱり強い～',
        '同時～！あ、こんなの初めて～キミ、すごい～！尊敬しちゃう～ふふふ～でも次は絶対勝つんだけど～ふふふふ～',
        'あ、同点～！びっくりした～うち、こんなの初めて～キミ、やるじゃない～本当に～ふふふ～',
        'え、同時に揃った～！あ、キミって運もいいんだ～うちと同じレベル～怖い～ふふふ～',
        'タイ～！面白い～うち、こんなの初めてかも～キミとのビンゴ、意外と面白い～ふふふ～',
        '同点…あ、キミも結構やるんだね～意外～でも最終的に勝つのはうちなんだけど～ふふふ～',
        '引き分け…珍しい…キミ、すごい…本気で認めた～でも次は負けないんだから～覚悟しときなさい～ふふふふ～',
      ],
      playerWin: [
        '💔 あぁぁぁ負けちゃった～！キミのボードで5個揃っちゃった～！悔しいんよ！！！キミ、やるじゃない～次は絶対負けないんだから～覚悟しときなさいよね～！',
        '💔 え、うそ、キミの勝ち～！？うちが選んだ数字でビンゴ成立しちゃったの～！？ぐぬぬ、悔しい～！キミ、なかなかやるわね～認めてあげる～！',
        '💔 キミがビンゴ～！うち、負けちゃった…悔しいな～でもね、キミ強かったよ、本当に～次こそはうちが勝つんだからね～絶対よ～！',
        '💔 あーもう！キミの勝利確定じゃない～！うちの選んだ数字がキミのビンゴを完成させちゃうなんて～悔しすぎる～！でもいい勝負だったわ～！',
        '💔 ビンゴされちゃった～！キミ、すごいじゃない～！うち、全力だったのに負けるなんて～この悔しさ、次にぶつけてやるんだから～覚悟しときなさい～！',
        '💔 うわぁぁぁキミが5個揃えちゃった～！うちの負け～！くやしい～！でもキミ、本当に強かったわ～素直に認める～次は負けないけどね～！',
        '💔 キミのビンゴ成立～！うち、やられちゃった～悔しいけど、キミの実力は認めてあげる～でも次は容赦しないんだからね～うふふ～！',
        '💔 あ、キミが勝っちゃった～！うちの選択がキミを勝たせちゃったなんて～ぐぬぬ～でもいい勝負だった～リベンジさせてもらうわよ～！',
        '💔 キミの勝ち～！5個揃っちゃった～！うち、悔しくて泣きそうなんだけど～でもキミ、やるわね～次は覚悟しときなさいよ～！',
        '💔 負けた～！キミにビンゴ取られちゃった～！あーもう悔しい～！でもね、この悔しさがうちを強くするんだから～待っててよね～！',
      ],
      lunaWin: [
        '🎉 やったぁぁぁ！うちの勝ち～！キミが選んだ数字でうちのボード5個揃っちゃった～！ふふふふ！これがルナ様の実力なんよ～！',
        '🎉 ビンゴ～！うち、勝っちゃった～！キミの選択がうちを勝たせてくれたわね～ありがとう～って言うべきかしら～うふふふ～！',
        '🎉 うちのボードで5個揃った～！勝利確定～！キミ、いい勝負だったわよ～でもうちのほうがちょっと上だったってことね～ふふふ～！',
        '🎉 キミが選んでくれた数字でビンゴ成立～！うちの勝ち～！やったー！この勝利の味、最高なんよ～！',
        '🎉 勝った勝った勝った～！うちのビンゴ完成～！キミ、悔しいでしょ～でも次も頑張ってね～うちに挑戦してくれるの待ってるから～！',
        '🎉 うちが5個揃えちゃった～！ビンゴ～！女神の祝福がうちに降り注いでる～キミも頑張ったけど、今回はうちの勝ちね～ふふふ～！',
        '🎉 ビンゴビンゴビンゴ～！うちの圧勝じゃない～！キミ、もうちょっと頑張れたんじゃない～？うふふ、冗談よ～いい勝負だったわ～！',
        '🎉 やりました～！うちの勝利～！5個揃っちゃった～！このテンション、このまま維持していくわよ～次もよろしくね～！',
        '🎉 うちがビンゴ取っちゃった～！キミ、残念だったわね～でも楽しかったでしょ～？うちはすっごく楽しかった～また遊ぼうね～！',
        '🎉 勝利の女神がうちに微笑んでる～！5個揃った～！キミとのビンゴ、最高に楽しかったわ～次は負けないように頑張ってね～うふふ～！',
      ],
      lunaSelect: [
        `${number} をぽちっ～！あ、ちなみにね、うち昨日すごい美味しいケーキ食べたんよ～生クリームたっぷりで～ふふふ～`,
        `${number} で〜す！このテンション、止まんない～うち、常にハイテンションなんよ～あ、何か音楽とか聴く～？うちはクラシック好きなんよ～`,
        `${number} ～！ふっふっふ、あ、キミのボード見たい～どうなってるのかな～ふふふ～`,
        `${number} をチョイス～！こっちはね、戦略があるんよ～って言うと思ったでしょ～実は適当よ～ふふふ～`,
        `ふふ、${number} を選んじゃう～！このテンションで突き進む～あ、そういえばうち、昨日の晩御飯カレーうどん食べたんよ～美味しかったなあ～`,
        `${number} ね！え、これ当たるのかな～ふふふ～でもね、うちは運がいいんよ～女神に愛されてる～ふふふふ～`,
        `${number} でーす！あ、キミって何が好物～？うちは何でも大好きなんよ～特にお菓子～食べないことないんだけど、やっぱり食べてる～ふふふ～`,
        `${number} ～！うち、今すごい集中力で選んでるんだけど、それでも別のこと考えてる～あ、晩御飯何にしようかな～ふふふ～`,
        `${number} をぽいっ～！あ、最近新しいお友達ができたんよ～すごく可愛い子～うちと気が合うんよ～ふふふ～`,
        `${number} で～す！うち、実は占いとか好きなんよ～今日のラッキーナンバー当たった～ふふふ～`,
        `${number} ね！あ、キミって何時に寝る～？うちは夜更かし得意なんよ～つい朝まで起きちゃう～ふふふ～`,
        `${number} をたっち～！あ、そういえばね、うち、新しいヘアスタイル考え中なんだけど～何がいいと思う～？ふふふ～`,
        `${number} ～！うち、今日すごくいい気分～朝からテンション最高～ふふふ～あ、毎日こんな感じなんだけど～ふふふふ～`,
        `${number} でーっ！あ、キミ、推しのアニメキャラとかいる～？うちはね、可愛い子ばっかり好きなんよ～ふふふ～`,
        `${number} をぽちっ～！昨日、映画見に行ったんよ～すごく泣いちゃった～あ、でも今はビンゴに集中～ふふふ～`,
        `${number} で～す！あ、うち、最近ダイエット中かも～って言うと思ったでしょ～食べてます～ふふふ～`,
        `${number} ね～！あ、何か季節の話～冬は好き～？うちは冬のお菓子が好き～温かいやつ～ふふふ～`,
        `${number} をたっち～！あ、キミの周りに変な人いる～？うちはね、自分が一番変かな～ふふふ～ハイテンション過ぎて～ふふふふ～`,
      ],
      playerReach: [
        `${number} を選んだら…えっ、キミがリーチ！？やられた～！キミ、あと1個で勝ちじゃない～！うち、次は慎重に選ばないと～ドキドキしてきた～！`,
        `${number} …あ、キミのボードで4個揃っちゃった～！キミのリーチ確定じゃない～！まずいまずい、うち、地雷踏まないように選ばなきゃ～！`,
        `${number} で…え、キミがリーチ！？もう4個揃ってるの！？危ない危ない～！うち、ここからが正念場ね～心臓バクバクなんよ～！`,
        `${number} ！あ、キミがリーチしちゃった～！えーと、何を選んだらキミが5個揃わないかな～焦る～！うちの手も震えてきた～！`,
        `${number} ！ピンチ！キミがリーチ取っちゃった～！うち、頑張って地雷避けなきゃ～ここが勝負の分かれ目よね～！`,
        `${number} ！キミのリーチ確定～！わわわ、うち、次に何を選んでもキミが5個揃っちゃう可能性があるじゃない～緊張する～！`,
      ],
      lunaReach: [
        `${number} を選んでくれたおかげで…うちのリーチ成立～！ふふふ、うち、あと1個で勝ちなんよ～！キミ、もう1回選んでね～地雷踏まないように頑張って～！`,
        `${number} ！あ、うちのボードで4個揃っちゃった～！リーチだ～！キミ、大変ね～次にうちのビンゴ完成させちゃうかもよ～ふふふ～！`,
        `${number} で…うちがリーチになっちゃった～！あと1個で勝ち～！キミ、どうする～？うち、ドキドキわくわくが止まらないんですけど～！`,
        `${number} ！え、リーチ来ちゃった～！うち、あと1個よ～！キミ、次に何を選ぶか慎重にね～うちの勝利を阻止できるかな～ふふふ～！`,
        `${number} ！うちのリーチ確定～！キミ、もう1回番が来るわよ～地雷原を歩くことになっちゃったわね～うち、ワクワクが止まらない～！`,
        `${number} ！わーいリーチ～！うち、あと1個で勝っちゃうんだけど～キミ、気をつけてね～って言っても難しいかも～うちの運、最高だから～！`,
      ],
      lunaTurn: [
        'ターン...何を選ぶのかな～！ふふふ～うち、どの数字を選んだら勝てるのかな～考え中～あ、でもね、うち、どの選択肢を選んでも運がついてくるんよ～ふふふ～',
        '考え中…何か企んでる～！ふふふふ～秘密の作戦を考えてるんよ～キミには教えない～あ、そういえばね、うち、最近新しいお洋服買ったんだけど～すごく可愛いんよ～ふふふ～',
        '何か企んでる…こわい～！ふふふ～うち、いい数字が来るように祈ってる～あ、キミ、何か欲しいものある～？うちは別に全部持ってるから～ふふふ～',
        'ふふふ…いい数字が来るといいな～！うち、めっちゃ真剣に選んでる～キミには内緒～ほら、直感ってのがあるわけよ～うちはね、女神の寵愛を受けてるんよ～ふふふ～',
        '次は何にしようかな～！うちの勝利のために～ふふふ～最高の数字を選んじゃおう～あ、ちなみにうち、スイーツは全部好きなんよ～フルーツケーキも、チョコも、和菓子も～ふふふ～',
        '必死に考えてる…キミには内緒にしとく～！ふふふ～うち、究極の選択をしてる～勝利か敗北か、その分かれ目がここ～でもうち、絶対勝つんだけど～ふふふふ～',
        'ターン中…あ、ちなみにうち、朝は毎日ダブルのサンドイッチ食べるんよ～それでもお昼お腹空くんだけど～ふふふ～あ、今何時～？',
        '選択中…うち、今めっちゃ考えてる～！あ、でもね、どれ選んでも同じ～うち、勝つってことが決まってるんよ～運命よ～ふふふふ～',
        'うーん…難しい～！でもね、うち、なんか直感が働く～ふふふ～あ、キミって占いとか信じる～？うちはね、星座占い毎日チェックする～今日も占い見たわ～ふふふ～',
        '考え中～うち、本気モード～！あ、でもね、相手のキミが強いと思ったのは初めて～尊敬しちゃう～でも勝つのはうちだけど～ふふふ～',
        'ターン…あ、そういえば、キミって何の星座～？うちは♎なんよ～天秤座～ふふふ～あ、星座で性格分かるらしいけど～ほんとかな～',
        '選択中…あ、今日お天気いいな～って思った～！外出たい～でもゲーム続けなきゃ～ふふふ～キミ、外出たくない～？',
        'うーん…何を選ぼうかな～！あ、ちなみにうち、甘党なんよ～辛いものあんまり好きじゃない～スイーツ食べてるのが幸せ～ふふふ～',
        '考え中…あ、うち、最近ハマってることがあるんよ～それはね～秘密～！ふふふ～でもね、ビンゴくらい面白い～ふふふふ～',
        'ターン中…あ、キミ、何か得意なことあるのかな～？うちはね、食べること～それと、ビンゴ～ふふふ～あ、あとおしゃべり～ふふふふ～',
        '選択中…あ、ちなみにね、うち、夜中にお菓子を食べちゃうんよ～そっとね～ふふふ～隠れて食べちゃう～ふふふふ～',
        'ターン...うち、ドキドキが止まらない～選択って難しい～でも楽しい～ふふふ～',
        '考え中…何を選ぼうかな～運命の分かれ道～ふふふ～でもうちの運なら大丈夫～ふふふふ～',
      ],
      playerTurnAgain: [
        'キミのターンだね～もう１回選んでいいんよ～でもね、地雷を踏まないようにね～ふふふ～',
        'キミがもう１回選ぶんよ～慎重にね～うち、ワクワクして見てる～ふふふふ～',
      ]
    };
    const msgList = messages[type];
    return msgList[Math.floor(Math.random() * msgList.length)];
  };

  const [lastCpuNumber, setLastCpuNumber] = useState(null);
  const [playerReach, setPlayerReach] = useState(false);
  const [cpuReach, setCpuReach] = useState(false);
  const [reachMode, setReachMode] = useState(null);
  const [message, setMessage] = useState('');
  const [playerReachLines, setPlayerReachLines] = useState([]);
  const [cpuReachLines, setCpuReachLines] = useState([]);
  const [playerWinLines, setPlayerWinLines] = useState([]);
  const [cpuWinLines, setCpuWinLines] = useState([]);

  const playSound = (type) => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      switch(type) {
        case 'select':
          oscillator.frequency.value = 800;
          gainNode.gain.value = 0.1;
          oscillator.start();
          oscillator.stop(audioContext.currentTime + 0.1);
          break;
        case 'cpu-select':
          oscillator.frequency.value = 600;
          gainNode.gain.value = 0.15;
          oscillator.start();
          oscillator.stop(audioContext.currentTime + 0.15);
          break;
        case 'reach':
          oscillator.frequency.value = 1000;
          gainNode.gain.value = 0.2;
          oscillator.start();
          oscillator.stop(audioContext.currentTime + 0.2);
          setTimeout(() => {
            const osc2 = audioContext.createOscillator();
            const gain2 = audioContext.createGain();
            osc2.connect(gain2);
            gain2.connect(audioContext.destination);
            osc2.frequency.value = 1200;
            gain2.gain.value = 0.2;
            osc2.start();
            osc2.stop(audioContext.currentTime + 0.2);
          }, 150);
          break;
        case 'win':
          [800, 1000, 1200, 1500].forEach((freq, i) => {
            setTimeout(() => {
              const osc = audioContext.createOscillator();
              const gain = audioContext.createGain();
              osc.connect(gain);
              gain.connect(audioContext.destination);
              osc.frequency.value = freq;
              gain.gain.value = 0.15;
              osc.start();
              osc.stop(audioContext.currentTime + 0.15);
            }, i * 100);
          });
          break;
        case 'lose':
          oscillator.frequency.value = 300;
          gainNode.gain.value = 0.2;
          oscillator.start();
          oscillator.stop(audioContext.currentTime + 0.3);
          break;
      }
    } catch (e) {
      console.log('Audio not supported');
    }
  };

  const handleJankenChoice = (choice) => {
    setJankenPlayerChoice(choice);
    const choices = ['グー', 'チョキ', 'パー'];
    const emojis = { 'グー': '✊', 'チョキ': '✌️', 'パー': '✋' };
    const cpuChoice = choices[Math.floor(Math.random() * 3)];
    setJankenCpuChoice(cpuChoice);
    
    const winCondition = (player, cpu) => {
      if (player === cpu) return 'draw';
      if (player === 'グー' && cpu === 'チョキ') return 'player-win';
      if (player === 'チョキ' && cpu === 'パー') return 'player-win';
      if (player === 'パー' && cpu === 'グー') return 'player-win';
      return 'cpu-win';
    };
    
    const result = winCondition(choice, cpuChoice);
    
    if (result === 'draw') {
      setMessage(`キミ: ${emojis[choice]} 🔺 vs うち: ${emojis[cpuChoice]} 🔺\n\n${getRandomMessage('jankenDraw')}`);
      setTimeout(() => {
        setJankenPlayerChoice(null);
        setJankenCpuChoice(null);
      }, 2000);
    } else if (result === 'player-win') {
      // ユーザーが勝った（ルナが負けた）→ ルナが先に選ぶ
      setMessage(`キミ: ${emojis[choice]} ⭕️ vs うち: ${emojis[cpuChoice]} ❌\n\n${getRandomMessage('jankenLose')}`);
      // ボードを初期化
      initializeBoard();
      // 3秒待ってからルナが選ぶ
      setTimeout(() => {
        setCurrentTurn('cpu');
        cpuTurn(new Set());
      }, 3000);
    } else {
      // ユーザーが負けた（ルナが勝った）→ ユーザーが先に選ぶ
      setMessage(`キミ: ${emojis[choice]} ❌ vs うち: ${emojis[cpuChoice]} ⭕️\n\n${getRandomMessage('jankenWin')}`);
      // ボードを初期化
      initializeBoard();
      setCurrentTurn('player');
    }
  };

  const initializeBoard = () => {
    const numbers = Array.from({ length: 25 }, (_, i) => i + 1);
    const shuffle = (arr) => {
      const shuffled = [...arr];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    };

    const playerNums = shuffle([...numbers]);
    const cpuNums = shuffle([...numbers]);

    const createBoard = (nums) => {
      const board = [];
      for (let i = 0; i < 5; i++) {
        board.push(nums.slice(i * 5, (i + 1) * 5));
      }
      return board;
    };

    setPlayerBoard(createBoard(playerNums));
    setCpuBoard(createBoard(cpuNums));
    setSelfMarks(new Set());
    setOpponentMarks(new Set());
    setUsedNumbers(new Set());
    setGameStatus('playing');
    setCurrentTurn('janken');
    setPlayerReach(false);
    setCpuReach(false);
    setReachMode(null);
    setLastCpuNumber(null);
    setTurnHistory([]);
    setPlayerReachLines([]);
    setCpuReachLines([]);
    setPlayerWinLines([]);
    setCpuWinLines([]);
  };

  useEffect(() => {
    initializeBoard();
    setMessage(getRandomMessage('jankenStart'));
  }, []);

  const checkLines = (board, marks) => {
    const lines = [];
    
    for (let i = 0; i < 5; i++) {
      const line = [];
      for (let j = 0; j < 5; j++) {
        line.push(board[i][j]);
      }
      lines.push(line);
    }
    
    for (let j = 0; j < 5; j++) {
      const line = [];
      for (let i = 0; i < 5; i++) {
        line.push(board[i][j]);
      }
      lines.push(line);
    }
    
    const diag1 = [];
    for (let i = 0; i < 5; i++) {
      diag1.push(board[i][i]);
    }
    lines.push(diag1);
    
    const diag2 = [];
    for (let i = 0; i < 5; i++) {
      diag2.push(board[i][4 - i]);
    }
    lines.push(diag2);

    let maxCount = 0;
    let hasReach = false;
    let hasWin = false;

    for (const line of lines) {
      const count = line.filter(num => marks.has(num)).length;
      maxCount = Math.max(maxCount, count);
      if (count === 4) hasReach = true;
      if (count === 5) hasWin = true;
    }

    return { hasReach, hasWin, maxCount };
  };

  // 特定の数字が含まれるラインだけをチェック
  const checkLinesForNumber = (board, marks, number, usedNumbers) => {
    // ボード上でこの数字の位置を見つける
    let row = -1;
    let col = -1;
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        if (board[i][j] === number) {
          row = i;
          col = j;
          break;
        }
      }
      if (row !== -1) break;
    }

    if (row === -1) return { hasReach: false, hasWin: false, reachLines: [] };

    const linesToCheck = [];
    const lineInfo = [];

    // 横のライン
    const horizontal = [];
    for (let j = 0; j < 5; j++) {
      horizontal.push(board[row][j]);
    }
    linesToCheck.push(horizontal);
    lineInfo.push({ type: 'horizontal', index: row });

    // 縦のライン
    const vertical = [];
    for (let i = 0; i < 5; i++) {
      vertical.push(board[i][col]);
    }
    linesToCheck.push(vertical);
    lineInfo.push({ type: 'vertical', index: col });

    // 斜め（左上から右下）- この数字が対角線上にある場合のみ
    if (row === col) {
      const diag1 = [];
      for (let i = 0; i < 5; i++) {
        diag1.push(board[i][i]);
      }
      linesToCheck.push(diag1);
      lineInfo.push({ type: 'diagonal1' });
    }

    // 斜め（右上から左下）- この数字が逆対角線上にある場合のみ
    if (row + col === 4) {
      const diag2 = [];
      for (let i = 0; i < 5; i++) {
        diag2.push(board[i][4 - i]);
      }
      linesToCheck.push(diag2);
      lineInfo.push({ type: 'diagonal2' });
    }

    let hasReach = false;
    let hasWin = false;
    const reachLines = [];
    const winLines = [];

    for (let i = 0; i < linesToCheck.length; i++) {
      const line = linesToCheck[i];
      const count = line.filter(num => marks.has(num)).length;
      const unselected = line.filter(num => !usedNumbers.has(num));
      if (count === 4 && unselected.length === 1) {
        hasReach = true;
        reachLines.push(lineInfo[i]);
      }
      if (count === 5) {
        hasWin = true;
        winLines.push(lineInfo[i]);
      }
    }

    return { hasReach, hasWin, reachLines, winLines };
  };

  // AIのスマート選択 - 自分のボードだけを見て判定
  const getDefensiveMove = (currentUsedNumbers, opponentMarks, myMarks, myBoard) => {
    const availableNumbers = Array.from({ length: 25 }, (_, i) => i + 1)
      .filter(num => !currentUsedNumbers.has(num));
    
    if (availableNumbers.length === 0) return null;
    
    // 各マスについてスコアを計算
    const scoreMap = {};
    
    for (const num of availableNumbers) {
      let row = -1, col = -1;
      for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
          if (myBoard[i][j] === num) {
            row = i;
            col = j;
            break;
          }
        }
        if (row !== -1) break;
      }
      
      if (row === -1) continue;
      
      // このマスが含まれるすべてのラインを取得
      const lines = [];
      
      // 行
      const horizontal = [];
      for (let j = 0; j < 5; j++) {
        horizontal.push(myBoard[row][j]);
      }
      lines.push(horizontal);
      
      // 列
      const vertical = [];
      for (let i = 0; i < 5; i++) {
        vertical.push(myBoard[i][col]);
      }
      lines.push(vertical);
      
      // 斜め
      if (row === col) {
        const diag1 = [];
        for (let i = 0; i < 5; i++) {
          diag1.push(myBoard[i][i]);
        }
        lines.push(diag1);
      }
      
      if (row + col === 4) {
        const diag2 = [];
        for (let i = 0; i < 5; i++) {
          diag2.push(myBoard[i][4 - i]);
        }
        lines.push(diag2);
      }
      
      // スコア計算：相手のボードは見えない。自分のボード上の情報だけ使う
      let isDangerous = false;
      let score = 0;
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const opponentCount = line.filter(n => opponentMarks.has(n)).length;
        
        // このラインに相手の○が4個 → 置いたら自分のビンゴが完成できない
        if (opponentCount === 4) {
          isDangerous = true;
        }
        
        // 相手の○が多いほど低スコア（置きたくない）
        score -= opponentCount;
        
        // ライン種別を判定（斜めかどうか）
        let isDiagonal = false;
        if (i === 2) isDiagonal = true; // diagonal1
        if (i === 3) isDiagonal = true; // diagonal2
        
        // 斜めのラインで相手の○が0個 → 「いけるかも」なラインなので置きたくない
        if (isDiagonal && opponentCount === 0) {
          score -= 1;
        }
      }
      
      if (isDangerous) {
        scoreMap[num] = -1000; // 絶対避ける
      } else {
        scoreMap[num] = score;
      }
    }
    
    // スコアが最も高いマスを選ぶ
    let bestNum = null;
    let bestScore = -Infinity;
    
    for (const num of availableNumbers) {
      if (scoreMap[num] > bestScore) {
        bestScore = scoreMap[num];
        bestNum = num;
      }
    }
    
    return bestNum;
  };

  const handleAutoSelect = () => {
    const num = getDefensiveMove(usedNumbers, opponentMarks, selfMarks, playerBoard);
    if (num) {
      handleNumberClick(num);
    }
  };

  const cpuTurn = (currentUsedNumbers) => {
    const randomNum = getDefensiveMove(currentUsedNumbers, selfMarks, opponentMarks, cpuBoard);
    
    if (!randomNum) {
      setGameStatus('draw');
      setMessage(getRandomMessage('draw'));
      return;
    }

    setTimeout(() => {
      handleNumberClick(randomNum, true, currentUsedNumbers);
    }, 1500);
  };

  const handleNumberClick = (number, isCpuMove = false, providedUsedNumbers = null) => {
    if (gameStatus !== 'playing') return;
    
    const currentUsedNumbers = providedUsedNumbers || usedNumbers;
    
    if (currentUsedNumbers.has(number)) return;
    if (!isCpuMove && currentTurn !== 'player') return;
    if (reachMode && !isCpuMove) return;

    const newUsedNumbers = new Set(currentUsedNumbers);
    newUsedNumbers.add(number);
    setUsedNumbers(newUsedNumbers);

    if (isCpuMove) {
      const newOpponentMarks = new Set(opponentMarks);
      newOpponentMarks.add(number);
      setOpponentMarks(newOpponentMarks);

      setLastCpuNumber(number);
      setTimeout(() => setLastCpuNumber(null), 1500);
      setTurnHistory(prev => [...prev, { player: 'cpu', number }]);
      
      playSound('cpu-select');
      // プレイヤーのリーチ = プレイヤーのボード上で○（opponentMarks）が4つ揃った状態
      const playerBoardCheck = checkLinesForNumber(playerBoard, newOpponentMarks, number, newUsedNumbers);

      if (playerBoardCheck.hasWin) {
        // UI が更新されるのを待ってから勝利判定を表示
        setPlayerWinLines(playerBoardCheck.winLines);
        setTimeout(() => {
          setGameStatus('player-win');
          setMessage(getRandomMessage('playerWin'));
          setPlayerReach(false);
          setCpuReach(false);
          setReachMode(null);
          playSound('win');
        }, 300);
        return;
      }

      if (playerBoardCheck.hasReach && !reachMode) {
        setPlayerReach(true);
        setPlayerReachLines(playerBoardCheck.reachLines);
        // 1秒待ってからリーチ表示
        setTimeout(() => {
          setReachMode('player-reach');
          setMessage(getRandomMessage('playerReach', number));
          setCurrentTurn('cpu');
          playSound('reach');
        }, 1000);
      } else {
        setPlayerReach(false);
        setPlayerReachLines([]);
        if (!playerBoardCheck.hasReach) {
          setReachMode(null);
        }
        setCurrentTurn('player');
      }
    } else {
      const newSelfMarks = new Set(selfMarks);
      newSelfMarks.add(number);
      setSelfMarks(newSelfMarks);

      setTurnHistory(prev => [...prev, { player: 'player', number }]);

      playSound('select');

      // 今回置いた数字が含まれるラインだけをチェック
      const cpuBoardCheck = checkLinesForNumber(cpuBoard, newSelfMarks, number, newUsedNumbers);

      if (cpuBoardCheck.hasWin) {
        // UI が更新されるのを待ってから勝利判定を表示
        setCpuWinLines(cpuBoardCheck.winLines);
        setTimeout(() => {
          setGameStatus('luna-win');
          setMessage(getRandomMessage('lunaWin'));
          setPlayerReach(false);
          setCpuReach(false);
          setReachMode(null);
          playSound('lose');
        }, 300);
        return;
      }

      if (cpuBoardCheck.hasReach && !reachMode) {
        setCpuReach(true);
        setCpuReachLines(cpuBoardCheck.reachLines);
        setReachMode('luna-reach');
        setMessage(getRandomMessage('lunaReach', number));
        setCurrentTurn('player');
        playSound('reach');
      } else {
        setCpuReach(false);
        setCpuReachLines([]);
        if (!cpuBoardCheck.hasReach) {
          setReachMode(null);
        }
        setMessage(getRandomMessage('lunaTurn'));
        setCurrentTurn('cpu');
        cpuTurn(newUsedNumbers);
      }
    }
  };

  const handleReachClick = () => {
    if (reachMode === 'player-reach') {
      setReachMode(null);
      setPlayerReach(false);
      setPlayerReachLines([]);
      setPlayerWinLines([]);
      setMessage(getRandomMessage('lunaTurn'));
      setCurrentTurn('cpu');
      cpuTurn(usedNumbers);
    } else if (reachMode === 'luna-reach') {
      setReachMode(null);
      setCpuReach(false);
      setCpuReachLines([]);
      setCpuWinLines([]);
      setMessage(getRandomMessage('playerTurnAgain'));
      setCurrentTurn('player');
    }
  };

  const renderCell = (number, boardType = 'player', row = -1, col = -1) => {
    // リーチ線に含まれているかチェック
    const isInReachLine = () => {
      // playerBoardを表示中 → playerReachLines（プレイヤーのリーチ）を表示
      // cpuBoardはデバッグ用なのでリーチ表示不要
      const reachLines = boardType === 'player' ? playerReachLines : [];
      if (reachLines.length === 0 || row === -1 || col === -1) return false;
      
      for (const line of reachLines) {
        if (line.type === 'horizontal' && line.index === row) return true;
        if (line.type === 'vertical' && line.index === col) return true;
        if (line.type === 'diagonal1' && row === col) return true;
        if (line.type === 'diagonal2' && row + col === 4) return true;
      }
      return false;
    };

    // win線に含まれているかチェック
    const isInWinLine = () => {
      // playerBoardを表示中 → playerWinLines（プレイヤーのビンゴ）を表示
      // cpuBoardはデバッグ用なのでビンゴ表示不要
      const winLines = boardType === 'player' ? playerWinLines : [];
      if (winLines.length === 0 || row === -1 || col === -1) return false;
      
      for (const line of winLines) {
        if (line.type === 'horizontal' && line.index === row) return true;
        if (line.type === 'vertical' && line.index === col) return true;
        if (line.type === 'diagonal1' && row === col) return true;
        if (line.type === 'diagonal2' && row + col === 4) return true;
      }
      return false;
    };

    const isSelfMarked = selfMarks.has(number);
    const isOpponentMarked = opponentMarks.has(number);
    const isUsed = usedNumbers.has(number);
    const inReach = isInReachLine();
    const inWin = isInWinLine();

    let bgColor = 'bg-white';
    let borderColor = 'border-gray-300';

    if (boardType === 'player') {
      if (inWin) {
        bgColor = 'bg-green-300';
        borderColor = 'border-green-600';
      } else if (inReach) {
        bgColor = 'bg-yellow-200';
        borderColor = 'border-yellow-500';
      } else if (isOpponentMarked) {
        bgColor = 'bg-pink-200';
        borderColor = 'border-pink-400';
      } else if (isSelfMarked) {
        bgColor = 'bg-blue-200';
        borderColor = 'border-blue-400';
      }
    }

    const canClick = !isUsed && currentTurn === 'player' && gameStatus === 'playing' && !reachMode && boardType === 'player';
    
    return (
      <div 
        key={`${boardType}-${number}`}
        onClick={() => canClick && handleNumberClick(number)}
        className={`
          w-16 h-16 flex items-center justify-center text-xl font-bold rounded-lg
          ${bgColor} border-2 ${borderColor} relative transition-all
          ${canClick ? 'cursor-pointer hover:scale-110 hover:shadow-lg' : ''}
          ${number === lastCpuNumber ? 'animate-pulse ring-4 ring-purple-400' : ''}
          ${inReach ? 'shadow-lg ring-2 ring-yellow-400' : ''}
          ${inWin ? 'shadow-xl ring-4 ring-green-500 animate-bounce' : ''}
        `}
      >
        <span className="relative z-10">{number}</span>
        {boardType === 'player' && isOpponentMarked && (
          <span className="absolute text-3xl text-pink-500 font-black">○</span>
        )}
        {boardType === 'player' && isSelfMarked && (
          <span className="absolute text-3xl text-blue-500 font-black">×</span>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-6xl font-black text-center mb-8 py-4">
          <span className="inline-block animate-bounce" style={{ color: '#9333ea', animationDelay: '0s' }}>🌟</span>
          <span className="inline-block mx-2" style={{ color: '#9333ea' }}>対</span>
          <span className="inline-block mx-2" style={{ color: '#ec4899' }}>戦</span>
          <span className="inline-block mx-2" style={{ color: '#ef4444' }}>ビ</span>
          <span className="inline-block mx-2" style={{ color: '#f97316' }}>ン</span>
          <span className="inline-block mx-2" style={{ color: '#eab308' }}>ゴ</span>
          <span className="inline-block animate-bounce" style={{ color: '#eab308', animationDelay: '0.2s' }}>🌟</span>
        </h1>

        <div className="flex justify-center gap-8 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <h2 className="text-2xl font-bold text-purple-600 mb-4 text-center">
              🎮 キミ のボード
            </h2>
            <div className="grid grid-cols-5 gap-2 justify-items-center">
              {playerBoard.map((row, i) =>
                row.map((num, j) => (
                  <div key={`player-${i}-${j}`}>
                    {renderCell(num, 'player', i, j)}
                  </div>
                ))
              )}
            </div>
            <div className="mt-4 text-center text-sm text-gray-600">
              {gameStatus === 'playing' && reachMode ? 
                <span className="font-bold text-lg text-purple-600">上の表示をクリックして続ける！</span> : 
                <span>○ = 相手が選んだ数字 | × = キミが選んだ数字</span>
              }
            </div>
          </div>

          <div className="bg-yellow-50 rounded-2xl p-6 shadow-xl border-2 border-yellow-300">
            <h2 className="text-2xl font-bold text-yellow-600 mb-4 text-center">
              🐛 ルナ（デバッグ）
            </h2>
            <div className="grid grid-cols-5 gap-2 justify-items-center">
              {cpuBoard.map((row, i) =>
                row.map((num, j) => {
                  const isSelfMarked = selfMarks.has(num);
                  const isCpuMarked = opponentMarks.has(num);
                  return (
                    <div 
                      key={`cpu-${i}-${j}`}
                      className={`
                        w-12 h-12 flex items-center justify-center text-sm font-bold rounded-lg relative
                        ${isCpuMarked ? 'bg-red-300 border-2 border-red-500' : isSelfMarked ? 'bg-blue-300 border-2 border-blue-500' : 'bg-yellow-100 border-2 border-yellow-300'}
                      `}
                    >
                      <span className="relative z-10">{num}</span>
                      {isCpuMarked && (
                        <span className="absolute text-2xl text-red-500 font-black">×</span>
                      )}
                      {isSelfMarked && (
                        <span className="absolute text-2xl text-blue-500 font-black">○</span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
            <div className="mt-4 text-center text-xs text-yellow-700">
              × = ルナ が選んだ数字 | ○ = キミが選んだ数字
            </div>
          </div>
        </div>

        <div className="text-center">
          {gameStatus === 'playing' && (
            <div className="mb-4 text-lg font-bold text-gray-700 flex gap-2 justify-between items-end px-4">
              <div className="flex gap-1 items-end flex-wrap">
                {turnHistory.map((turn, idx) => (
                  <div
                    key={idx}
                    className={`text-sm ${turn.player === 'player' ? 'text-blue-600' : 'text-red-600'}`}
                  >
                    {turn.number}
                  </div>
                ))}
                <div className="ml-2">
                  {currentTurn === 'janken' ? 'じゃんけん' :
                   currentTurn === 'player' ? `ターン${turnHistory.length + 1}：キミ` :
                   `ターン${turnHistory.length + 1}：ルナ`}
                </div>
              </div>
              {currentTurn === 'player' && gameStatus === 'playing' && !reachMode && (
                <button
                  onClick={handleAutoSelect}
                  className="bg-blue-500 text-white px-4 py-2 rounded-full font-bold text-sm cursor-pointer hover:scale-105 transition-transform shadow-lg flex items-center gap-2"
                >
                  <Wand2 className="w-4 h-4" />
                  おまかせ
                </button>
              )}
            </div>
          )}
          <p className="text-2xl font-bold text-purple-600 mb-4 whitespace-pre-line">{message}</p>
          <div className="flex justify-center gap-4 items-center flex-wrap relative">
            {currentTurn === 'janken' && (
              <>
                <button
                  onClick={() => handleJankenChoice('グー')}
                  className="bg-red-500 text-white px-8 py-4 rounded-full font-bold text-3xl cursor-pointer hover:scale-105 transition-transform shadow-lg"
                >
                  ✊
                </button>
                <button
                  onClick={() => handleJankenChoice('チョキ')}
                  className="bg-yellow-500 text-white px-8 py-4 rounded-full font-bold text-3xl cursor-pointer hover:scale-105 transition-transform shadow-lg"
                >
                  ✌️
                </button>
                <button
                  onClick={() => handleJankenChoice('パー')}
                  className="bg-blue-500 text-white px-8 py-4 rounded-full font-bold text-3xl cursor-pointer hover:scale-105 transition-transform shadow-lg"
                >
                  ✋
                </button>
              </>
            )}
            {reachMode === 'player-reach' && (
              <div 
                onClick={handleReachClick}
                className="bg-green-500 text-white px-8 py-4 rounded-full font-bold animate-pulse text-xl cursor-pointer hover:scale-105 transition-transform shadow-2xl"
              >
                <Target className="inline mr-2 w-8 h-8" />
                むむっ、ルナもう１回…
              </div>
            )}
            {reachMode === 'luna-reach' && (
              <div 
                onClick={handleReachClick}
                className="bg-red-500 text-white px-8 py-4 rounded-full font-bold animate-pulse text-xl cursor-pointer hover:scale-105 transition-transform shadow-2xl"
              >
                <Target className="inline mr-2 w-8 h-8" />
                ふふっ、キミもう１回です！
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-start px-8">
          <button
            onClick={() => {
              initializeBoard();
              setJankenPlayerChoice(null);
              setJankenCpuChoice(null);
              setMessage(getRandomMessage('jankenStart'));
            }}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-full text-xl font-bold hover:scale-105 transition-transform shadow-lg flex items-center gap-3"
          >
            <RotateCcw className="w-6 h-6" />
            新しいゲーム
          </button>
        </div>

        <div className="mt-8 bg-white rounded-2xl p-6 shadow-xl">
          <h3 className="text-2xl font-bold text-purple-600 mb-4">📋 ルール</h3>
          <ul className="space-y-2 text-gray-700">
            <li>✨ 5×5のマスに1～25の数字がランダムに配置されます～</li>
            <li>✨ キミとうちが交互に数字を選択しちゃいます～</li>
            <li>✨ キミが選んだ数字には × マーク、うちが選んだ数字には ○ マーク～</li>
            <li>✨ 一度使った数字は誰も使えないんですけど～</li>
            <li>✨ キミのボードで ○ が4つ揃ったら「キミのリーチ」～！うちがもう1回選ばされちゃう～</li>
            <li>✨ うちのボードで ○ が4つ揃ったら「うちのリーチ」～！キミがもう1回選ばされちゃう～</li>
            <li>✨ リーチの時は上の表示をクリックして続けるんですけど～</li>
            <li>✨ 5つ揃ったら（縦・横・斜め）勝利～！うふふふ！</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BattleBingo;

import React, { useState, useEffect } from 'react';
import { Sparkles, RotateCcw, Trophy, Target, Wand2 } from 'lucide-react';
import { M_PLUS_Rounded_1c } from 'next/font/google';

const displayFont = M_PLUS_Rounded_1c({
  weight: ['800'],
  subsets: ['latin'],
  variable: '--font-display',
});

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
  const [jankenRound, setJankenRound] = useState(1);
  const [turnHistory, setTurnHistory] = useState([]);
  const getRandomMessage = (type, number = null) => {
    const messages = {
      jankenStart: [
        'じゃんけんをしましょう。負けた方が先に選ぶルールですよ。',
        'まずはじゃんけんですね。負けたら先攻、覚えておいてくださいね。',
        'じゃんけん勝負です。真剣にいきますよ。',
        'グー、チョキ、パー。どれを選びますか？',
        'じゃんけんから始めましょう。ルールは簡単、負けた方が先攻です。',
        '手を選んでくださいね。わたし、油断はしませんよ。',
        'では、じゃんけんで先攻を決めましょうか。',
        '勝負の前に、まずはじゃんけんですね。',
      ],
      jankenWin: [
        '🎉 勝ちました！あなたが先攻ですね。',
        '🎉 勝たせてもらいました。準備してくださいね。',
        '🎉 わたしの勝ちです。どうぞ、先に選んでくださいね。',
        '🎉 やりました！このままビンゴも決めちゃいますよ。',
        '🎉 じゃんけんはわたしの勝ちです。あなたから始めてくださいね。',
        '🎉 幸先がいいですね。あなたが先攻です。',
      ],
      jankenLose: [
        '💔 負けちゃいました。わたしが先に選びますね。この分はビンゴで取り返します。',
        '💔 負けました。ビンゴでは絶対に逆転してみせますよ。',
        '💔 参りましたね。でもビンゴは別です。ちゃんと勝ちにいきますよ。',
        '💔 悔しいですけど、この分はビンゴでお返ししますね。',
        '💔 じゃんけんは負けちゃいましたけど、本番はここからです。',
        '💔 わたしが先攻ですね。慎重にいきましょう。',
      ],
      jankenDraw: [
        'あいこですね。もう一度いきましょう。',
        '同じでしたね。もう一度、決着つけましょう。',
        'あいこです。もう一度いきますよ。',
        'あいこですね。次こそ決めましょう。',
        'また同じ手でしたね。もう一回いきます。',
        '決着つきませんでしたね。続けましょう。',
      ],
      start: [
        'さあ、ビンゴの時間です。いきましょう。',
        '出番ですね。準備はいいですか？',
        'おまかせボタンに頼るのもアリですけど、あなたはどうしますか？',
        '選択の時間です。一緒にビンゴを完成させましょう。',
        'どちらが先に5つ揃えるか、見てましょうね。',
        'さあ、数字を選んでくださいね。ここからが本番です。',
        'ビンゴゲーム開始です。',
        '始まりますね。集中していきましょう。',
        'ビンゴの時間ですよ。',
        '選択の時間です。相手ではあるけど、正々堂々いきましょうね。',
        'お互いのボードに数字が揃いましたね。それじゃ始めましょう。',
        '油断は禁物です。いきましょう。',
        'ここからが本番ですね。気を引き締めていきます。',
        '準備は整いましたね。始めましょう。',
      ],
      draw: [
        '引き分けですね。あなた、なかなかやりますね。',
        'どちらも全力でしたね。次は負けませんよ。',
        '同点とは悔しいです。次はわたしが勝たせてもらいますね。',
        '引き分けとは珍しいこと。あなた、見事です。',
        '同時とは。素直に認めます、お強いですね。',
        '同点ですね。でも最終的に勝つのはわたしですよ。',
        '互角の勝負でしたね。次で決めましょう。',
        '同時にビンゴとは、いい勝負でしたね。',
      ],
      playerWin: [
        '💔 負けました。あなたのボードで5つ揃っちゃいましたね。次は絶対負けません。',
        '💔 あなたの勝ちです。わたしの選んだ数字でビンゴを完成させるなんて、見事です。',
        '💔 あなたのビンゴですね。悔しいですけど、本当に強かったです。',
        '💔 わたしの選んだ数字が仇になるなんて。いい勝負でしたね。',
        '💔 やられました。この悔しさ、次にぶつけさせてもらいますね。',
        '💔 負けちゃいましたね。この悔しさが、わたしを強くしてくれます。',
        '💔 完敗です。あなたの読み、見事でした。',
        '💔 わたしの負けですね。次こそは、と誓います。',
      ],
      lunaWin: [
        '🎉 わたしの勝ちです。あなたの選んだ数字でビンゴが完成しました。',
        '🎉 ビンゴです。あなたの選択に感謝しますね。',
        '🎉 わたしのボードで5つ揃いました。勝利です。',
        '🎉 あなたが選んでくれた数字でビンゴ成立、わたしの勝ちです。',
        '🎉 勝たせてもらいました。また挑んでくださいね。',
        '🎉 勝利です。次も油断しないでくださいね。',
        '🎉 わたしの勝ちですね。いい勝負でした。',
        '🎉 ビンゴが成立しました。次も期待してますよ。',
      ],
      lunaSelect: [
        `${number}、いただきます。`,
        `${number}にします。`,
        `${number}。あなたのボードも気になりますね。`,
        `${number}を選びますね。`,
        `${number}にしましょう。`,
        `${number}です。`,
        `${number}ですね。`,
        `${number}。今、集中してます。`,
        `${number}、こちらにします。`,
        `${number}です。これで決まりですね。`,
        `${number}を選ばせてもらいます。`,
        `${number}にしますね。`,
        `${number}。慎重に選びました。`,
        `${number}、これでいきます。`,
      ],
      playerReach: [
        `${number}。あなたがリーチですね。慎重にいかないと。`,
        `${number}。あなたのボードで4つ揃いました。まずいですね。`,
        `${number}で。もう4つ揃ってます。正念場です。`,
        `${number}。あなたがリーチです。気を引き締めないと。`,
        `${number}。ピンチです。地雷は避けないと。`,
        `${number}。あなたのリーチが確定しました。慎重にいきます。`,
        `${number}。これはうっかりでした。あなたのリーチですね。`,
        `${number}。油断しました。次の一手が肝心ですね。`,
      ],
      lunaReach: [
        `${number}のおかげで、わたしのリーチが成立しました。あと1つで勝ちです。`,
        `${number}。わたしのボードで4つ揃いました。リーチですね。`,
        `${number}で。わたしがリーチになりました。どうしますか？`,
        `${number}。リーチが来ました。あと1つですね。`,
        `${number}。わたしのリーチが確定しました。もう1回番が回りますよ。`,
        `${number}。リーチです。`,
        `${number}。あと1つで勝利です。`,
        `${number}。これで決まりが見えてきましたね。`,
      ],
      lunaTurn: [
        'どちらを選びましょうか。',
        '考え中です。作戦がありますよ。',
        '何を選ぶべきか、考えてます。',
        'いい数字が来るといいですね。',
        '次は何にしましょうか。最良の数字を選びますね。',
        '真剣に考えてます。勝敗の分かれ目ですもんね。',
        'ターン中です。今、集中してます。',
        '選択中です。慎重にいきますね。',
        '難しいところですね。',
        '考え中です。',
        '少々お待ちくださいね。',
        'このあたり、慎重に考えないと。',
        '盤面をよく見極めてます。',
        '次の一手が重要ですね。',
      ],
      playerTurnAgain: [
        'あなたのターンです。もう1回選んでくださいね。地雷には気をつけて。',
        'もう1回、あなたの番です。慎重に、わたしも見てますから。',
        'あなたの番が続きます。落ち着いて選んでくださいね。',
        'もう一度、あなたの番ですね。',
      ]
    };
    const msgList = messages[type];
    return msgList[Math.floor(Math.random() * msgList.length)];
  };

  const [boardMode, setBoardMode] = useState('closed'); // 'open' | 'closed'
  const [rulesModalOpen, setRulesModalOpen] = useState(false);
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
        setJankenRound(r => r + 1);
      }, 1000);
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
          w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center text-base sm:text-lg md:text-xl font-bold rounded-lg
          ${bgColor} border-2 ${borderColor} relative transition-all
          ${canClick ? 'cursor-pointer hover:scale-110 hover:shadow-lg' : ''}
          ${number === lastCpuNumber ? 'animate-pulse ring-4 ring-purple-400' : ''}
          ${inReach ? 'shadow-lg ring-2 ring-yellow-400' : ''}
          ${inWin ? 'shadow-xl ring-4 ring-green-500 animate-bounce' : ''}
        `}
      >
        <span className="relative z-10">{number}</span>
        {boardType === 'player' && isOpponentMarked && (
          <span className="absolute text-2xl sm:text-3xl text-pink-500 font-black">○</span>
        )}
        {boardType === 'player' && isSelfMarked && (
          <span className="absolute text-2xl sm:text-3xl text-blue-500 font-black">×</span>
        )}
      </div>
    );
  };

  const resetButtonEl = (
    <button
      onClick={() => {
        initializeBoard();
        setJankenPlayerChoice(null);
        setJankenCpuChoice(null);
        setJankenRound(1);
        setBoardMode('closed');
        setMessage(getRandomMessage('jankenStart'));
      }}
      className="bg-gray-400 text-white px-4 py-2 rounded-full text-xs sm:text-sm font-bold hover:scale-105 transition-transform shadow flex items-center gap-1.5"
    >
      <RotateCcw className="w-3.5 h-3.5" />
      リセット（強制終了）
    </button>
  );

  const playerBoardEl = (
    <div className="relative bg-white rounded-2xl p-2 sm:p-4 md:p-6 shadow-xl border border-purple-100">
      <h2 className="font-display text-sm sm:text-lg md:text-2xl font-bold text-purple-600 mb-1 sm:mb-3 md:mb-4 text-center">
        🎮 キミ のボード
      </h2>
      <div className="grid grid-cols-5 gap-1 justify-items-center">
        {playerBoard.map((row, i) =>
          row.map((num, j) => (
            <div key={`player-${i}-${j}`}>
              {renderCell(num, 'player', i, j)}
            </div>
          ))
        )}
      </div>
      <div className="mt-1 sm:mt-4 text-center text-[10px] sm:text-xs md:text-sm text-gray-600">
        {gameStatus === 'playing' && reachMode ?
          <span className="font-bold text-sm md:text-lg text-purple-600">上の表示をクリックして続ける！</span> :
          <span>○ = 相手が選んだ数字 | × = キミが選んだ数字</span>
        }
      </div>
    </div>
  );

  const historyEl = currentTurn !== 'janken' && (
    <div className="mt-1 flex items-center gap-1.5 flex-wrap text-[10px] sm:text-xs md:text-sm">
      <span className="font-bold text-gray-500">選択番号履歴:</span>
      {turnHistory.map((turn, idx) => (
        <span
          key={idx}
          className={`font-bold ${turn.player === 'player' ? 'text-blue-600' : 'text-red-600'}`}
        >
          {turn.number}
        </span>
      ))}
    </div>
  );

  const renderLunaBoard = (compact) => (
    <div className={`bg-amber-50 shadow-xl border border-amber-200 ${compact ? 'rounded-md p-1' : 'rounded-2xl p-3 sm:p-4 md:p-6'}`}>
      <h2 className={`font-display font-bold text-amber-600 text-center ${compact ? 'text-xs mb-0.5' : 'text-base md:text-2xl mb-3 md:mb-4'}`}>
        🐛 {compact ? 'ルナ' : 'ルナ（オープン公開中）'}
      </h2>
      <div className={`grid grid-cols-5 justify-items-stretch ${compact ? 'gap-0.5' : 'gap-0.5 md:gap-1'}`}>
        {cpuBoard.map((row, i) =>
          row.map((num, j) => {
            const isSelfMarkedCell = selfMarks.has(num);
            const isCpuMarkedCell = opponentMarks.has(num);
            return (
              <div
                key={`cpu-${i}-${j}`}
                className={`
                  flex items-center justify-center font-bold rounded relative
                  ${compact ? 'aspect-square w-full text-sm' : 'w-8 h-8 sm:w-10 sm:h-10 md:w-16 md:h-16 rounded-lg text-xs sm:text-sm md:text-xl'}
                  ${isCpuMarkedCell ? 'bg-red-300 border border-red-500' : isSelfMarkedCell ? 'bg-blue-300 border border-blue-500' : 'bg-amber-100 border border-amber-300'}
                `}
              >
                <span className="relative z-10">{num}</span>
                {isCpuMarkedCell && (
                  <span className={`absolute font-black text-red-500 ${compact ? 'text-base' : 'text-lg sm:text-xl md:text-2xl'}`}>×</span>
                )}
                {isSelfMarkedCell && (
                  <span className={`absolute font-black text-blue-500 ${compact ? 'text-base' : 'text-lg sm:text-xl md:text-2xl'}`}>○</span>
                )}
              </div>
            );
          })
        )}
      </div>
      {!compact && (
        <div className="mt-3 md:mt-4 text-center text-[10px] sm:text-xs text-amber-700">
          × = ルナ が選んだ数字 | ○ = キミが選んだ数字
        </div>
      )}
    </div>
  );

  const controlsEl = (
    <div className="text-center">
      {currentTurn === 'janken' && (
        <div className="mb-4">
          <label className="flex items-center justify-center gap-3 cursor-pointer select-none">
            <span className={`text-xs md:text-sm font-bold transition-colors ${boardMode === 'closed' ? 'text-gray-700' : 'text-gray-400'}`}>
              🙈 クローズ
            </span>
            <span
              role="switch"
              aria-checked={boardMode === 'open'}
              onClick={() => setBoardMode(boardMode === 'open' ? 'closed' : 'open')}
              className={`relative w-12 h-7 md:w-14 md:h-8 rounded-full transition-colors duration-200 ${boardMode === 'open' ? 'bg-yellow-500' : 'bg-gray-400'}`}
            >
              <span
                className={`absolute top-1 left-1 w-5 h-5 md:w-6 md:h-6 bg-white rounded-full shadow-md transition-transform duration-200 ${boardMode === 'open' ? 'translate-x-5 md:translate-x-6' : 'translate-x-0'}`}
              />
            </span>
            <span className={`text-xs md:text-sm font-bold transition-colors ${boardMode === 'open' ? 'text-yellow-600' : 'text-gray-400'}`}>
              👁️ オープン
            </span>
          </label>
          <p className="mt-1 text-[10px] md:text-xs text-gray-500 text-center">
            クローズ：ルナのボードは見えません／オープン：ルナのボードも見えます
          </p>
        </div>
      )}
      {gameStatus === 'playing' && (
        <div className="mb-2 sm:mb-4 bg-white/60 rounded-xl px-2 py-1 sm:px-4 sm:py-2 md:py-3 flex gap-2 items-end flex-wrap w-[98%] md:max-w-lg mx-auto">
          <div className="flex gap-1 items-end flex-wrap text-sm md:text-lg font-bold text-gray-700">
            <div>
              {currentTurn === 'janken' ? (jankenRound > 1 ? `じゃんけん（${jankenRound}回目）` : 'じゃんけん') :
               currentTurn === 'player' ? `ターン${turnHistory.length + 1}：キミ` :
               `ターン${turnHistory.length + 1}：ルナ`}
            </div>
          </div>
          {currentTurn === 'player' && gameStatus === 'playing' && !reachMode && (
            <button
              onClick={handleAutoSelect}
              className="ml-auto bg-blue-500 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-full font-bold text-xs md:text-sm cursor-pointer hover:scale-105 transition-transform shadow-lg flex items-center gap-1.5 md:gap-2"
            >
              <Wand2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
              おまかせ
            </button>
          )}
        </div>
      )}
      {!(boardMode === 'open' && currentTurn !== 'janken') && (
        <p className="text-sm sm:text-base md:text-2xl font-bold text-purple-600 mb-2 sm:mb-4 whitespace-pre-line px-1 max-w-[85%] sm:max-w-sm md:max-w-xl mx-auto">{message}</p>
      )}
      <div className="flex justify-center gap-3 md:gap-4 items-center flex-wrap relative">
        {currentTurn === 'janken' && jankenPlayerChoice === null && (
          <>
            <button
              onClick={() => handleJankenChoice('グー')}
              className="bg-red-500 text-white px-4 py-1.5 md:px-5 md:py-2 rounded-full font-bold text-xl md:text-2xl cursor-pointer hover:scale-105 transition-transform shadow-lg"
            >
              ✊
            </button>
            <button
              onClick={() => handleJankenChoice('チョキ')}
              className="bg-yellow-500 text-white px-4 py-1.5 md:px-5 md:py-2 rounded-full font-bold text-xl md:text-2xl cursor-pointer hover:scale-105 transition-transform shadow-lg"
            >
              ✌️
            </button>
            <button
              onClick={() => handleJankenChoice('パー')}
              className="bg-blue-500 text-white px-4 py-1.5 md:px-5 md:py-2 rounded-full font-bold text-xl md:text-2xl cursor-pointer hover:scale-105 transition-transform shadow-lg"
            >
              ✋
            </button>
          </>
        )}
        {reachMode === 'player-reach' && (
          <div
            onClick={handleReachClick}
            className="bg-green-500 text-white px-3 py-1.5 md:px-5 md:py-2.5 rounded-full font-bold animate-pulse text-xs md:text-base cursor-pointer hover:scale-105 transition-transform shadow-lg"
          >
            <Target className="inline mr-1 w-4 h-4 md:w-5 md:h-5" />
            ルナ、もう1回
          </div>
        )}
        {reachMode === 'luna-reach' && (
          <div
            onClick={handleReachClick}
            className="bg-red-500 text-white px-3 py-1.5 md:px-5 md:py-2.5 rounded-full font-bold animate-pulse text-xs md:text-base cursor-pointer hover:scale-105 transition-transform shadow-lg"
          >
            <Target className="inline mr-1 w-4 h-4 md:w-5 md:h-5" />
            キミ、もう1回です
          </div>
        )}
        {gameStatus !== 'playing' && (
          <button
            onClick={() => {
              initializeBoard();
              setJankenPlayerChoice(null);
              setJankenCpuChoice(null);
              setJankenRound(1);
              setBoardMode('closed');
              setMessage(getRandomMessage('jankenStart'));
            }}
            className="bg-purple-500 text-white px-4 py-1.5 md:px-6 md:py-2.5 rounded-full font-bold text-xs md:text-base cursor-pointer hover:scale-105 transition-transform shadow-lg flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5 md:w-4 md:h-4" />
            終了（次のゲームへ）
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className={`${displayFont.variable} min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 p-1.5 sm:p-4 md:p-6`}>
      <div className="max-w-5xl mx-auto">
        <h1
          className={`font-display font-black text-center transition-all ${
            currentTurn === 'janken'
              ? 'text-xl sm:text-2xl md:text-4xl mb-4 md:mb-6 py-1 md:py-2'
              : 'hidden md:block md:text-4xl md:mb-6 md:py-2'
          }`}
        >
          <span className="inline-block animate-bounce" style={{ color: '#9333ea', animationDelay: '0s' }}>🌟</span>
          <span className="inline-block mx-1 md:mx-2" style={{ color: '#9333ea' }}>対</span>
          <span className="inline-block mx-1 md:mx-2" style={{ color: '#ec4899' }}>戦</span>
          <span className="inline-block mx-1 md:mx-2" style={{ color: '#ef4444' }}>ビ</span>
          <span className="inline-block mx-1 md:mx-2" style={{ color: '#f97316' }}>ン</span>
          <span className="inline-block mx-1 md:mx-2" style={{ color: '#eab308' }}>ゴ</span>
          <span className="inline-block animate-bounce" style={{ color: '#eab308', animationDelay: '0.2s' }}>🌟</span>
        </h1>

        {currentTurn === 'janken' ? (
          <div className="mb-6 md:mb-8">{controlsEl}</div>
        ) : (
          <>
            <div className="mb-2 sm:mb-6 md:mb-8">
              {boardMode === 'open' && (
                <div className="flex items-stretch gap-2 w-[98%] md:max-w-lg mx-auto mb-1.5 sm:mb-2">
                  <div className="w-[40%] flex-shrink-0">
                    {renderLunaBoard(true)}
                  </div>
                  <div className="w-[58%] bg-white/85 rounded-lg shadow px-2 py-1.5 sm:px-3 sm:py-2 flex flex-col">
                    <div className="flex-1 flex items-center justify-center text-center text-[11px] sm:text-xs md:text-sm text-purple-600 font-bold whitespace-pre-line">
                      {message}
                    </div>
                    {historyEl}
                  </div>
                </div>
              )}
              <div className="flex justify-center">
                <div className="w-full max-w-xs sm:max-w-sm md:max-w-md">
                  {playerBoardEl}
                  {boardMode !== 'open' && historyEl}
                </div>
              </div>
            </div>
            {controlsEl}
          </>
        )}

        {rulesModalOpen && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setRulesModalOpen(false)}
          >
            <div
              className="bg-white rounded-2xl p-4 md:p-6 shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg md:text-xl font-bold text-purple-600">📋 ルール</h3>
                <button
                  onClick={() => setRulesModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold leading-none px-2"
                >
                  ×
                </button>
              </div>
              <ul className="space-y-2 text-sm md:text-base text-gray-700">
                <li>・ 5×5のマスに1〜25の数字がランダムに配置されます。</li>
                <li>・ じゃんけんで勝敗を決め、負けた方が先攻になります。</li>
                <li>・ プレイヤーとルナが交互に数字を選択します。</li>
                <li>・ プレイヤーが選んだ数字には × マーク、ルナが選んだ数字には ○ マークが付きます。</li>
                <li>・ 一度使用した数字は、以降どちらも選択できません。</li>
                <li>・ プレイヤーのボードで ○ が4つ揃うと「プレイヤーのリーチ」となり、ルナがもう1回選択します。</li>
                <li>・ ルナのボードで ○ が4つ揃うと「ルナのリーチ」となり、プレイヤーがもう1回選択します。</li>
                <li>・ リーチの際は、画面上部の表示をクリックして進めてください。</li>
                <li>・ 縦・横・斜めのいずれかで5つ揃えば勝利となります。</li>
                <li>・ 先攻は自分の数字に先に × がついてしまうため、実はやや不利です。中央など多くのライン上にあるマスの数字は特に価値が高いので狙い目です。</li>
              </ul>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mt-4 mb-4 w-[98%] md:max-w-lg mx-auto">
          {resetButtonEl}
          <button
            onClick={() => setRulesModalOpen(true)}
            className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-xs font-bold shadow hover:scale-105 transition-transform"
          >
            📋 ルール
          </button>
        </div>
      </div>
    </div>
  );
};

export default BattleBingo;

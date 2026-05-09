# 対戦ビンゴゲーム (Battle Bingo)

AIのキャラクター「ルナ」と対戦するビンゴゲームです。

## 🎮 ゲーム概要

プレイヤーがAI「ルナ」とじゃんけんをして、先攻後攻を決めてからビンゴをします。5×5のボードで数字を選んで先に5つ揃えた方が勝利です。

## 🚀 セットアップ

### 必要なもの
- Node.js 16.8 以上
- npm または yarn

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/wataameto/battle_bingo.git
cd battle_bingo

# 依存関係をインストール
npm install
# または
yarn install
```

## 🎯 実行方法

### 開発サーバーを起動
```bash
npm run dev
# または
yarn dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてゲームをプレイできます。

### 本番ビルド
```bash
npm run build
npm start
# または
yarn build
yarn start
```

## 📋 ゲームルール

1. **じゃんけん勝負**
   - プレイヤーとルナがじゃんけんをします
   - 勝った方が先に数字を選びます

2. **ビンゴ**
   - 5×5（25個）の数字が書かれたボードがあります
   - 交互に1～25の数字を選んでいきます
   - 選ばれた数字がボード上にあればマークされます
   - 縦・横・斜めのいずれかで5つのマークが揃ったら「ビンゴ」で勝利です

## 🛠️ 技術スタック

- **Next.js** - React フレームワーク
- **React** - UI ライブラリ
- **Tailwind CSS** - スタイリング
- **lucide-react** - アイコンライブラリ

## 📝 仕様書

詳細な仕様書は `battle-bingo-spec (2).md` を参照してください。

## 📄 ライセンス

このプロジェクトはオープンソースです。

## 🤝 貢献

改善提案やバグ報告は Issue で受け付けています。

# Koibumi Astro Blog

A astro blog template with [koibumi design system](https://github.com/koibumi-design)

## Installation

Just import this repository to your GitHub account, then clone it to your local machine.

```bash
git clone https://github.com/koibumi-design/astro-blog.git
```

Now, read the [documentation](https://astro.koibumi.art/) to learn how to use this template.

## microCMS連携設定

このテンプレートはマークダウン記事とmicroCMSの記事を混在させることができます。

### 設定方法

1. `.env`ファイルを作成し、以下の環境変数を設定してください：

```env
MICROCMS_SERVICE_DOMAIN=your-service-domain
MICROCMS_API_KEY=your-api-key
```

2. microCMSで`posts`というAPIを作成し、以下のフィールドを設定してください：

- `title` (テキスト) - 記事のタイトル
- `description` (テキスト) - 記事の説明
- `content` (リッチエディタ) - 記事の本文
- `heroImage` (画像) - アイキャッチ画像（オプション）
- `category` (コンテンツ参照 - categories) - カテゴリ（オプション）
- `tags` (複数コンテンツ参照 - tags) - タグ（オプション）
- `pinned` (真偽値) - ピン留め設定（オプション）
- `notCompleted` (真偽値) - 未完成フラグ（オプション）

### カテゴリとタグの設定

microCMSで以下のAPIも作成してください：

1. `categories` API:
   - `name` (テキスト) - カテゴリ名
   - `slug` (テキスト) - URL用スラッグ

2. `tags` API:
   - `name` (テキスト) - タグ名
   - `slug` (テキスト) - URL用スラッグ

マークダウン記事でも以下のようにカテゴリとタグを設定できます：

```md
---
title: '記事タイトル'
description: '記事の説明'
pubDate: '2023-03-26'
category: 'テクノロジー'
tags: ['JavaScript', 'Web開発', 'フロントエンド']
---
```

### 記事の表示

- マークダウン記事: `/blog/記事スラッグ`
- microCMS記事: `/blog/cms/記事ID`
- カテゴリ別記事: `/blog/category/カテゴリスラッグ`
- タグ別記事: `/blog/tag/タグスラッグ`

両方の記事が統合されてブログ一覧に表示されます。記事カードには記事の種類を示すバッジが表示されます。
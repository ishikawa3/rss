# RSS Feed Reader

[osmosfeed](https://github.com/osmoscraft/osmosfeed) を使ったパーソナルRSSリーダーです。  
購読フィードは [`osmosfeed.yaml`](./osmosfeed.yaml) で管理しており、GitHub Actions により毎日自動更新されます。

🌐 **公開URL**: https://ishikawa3.github.io/rss/

## 購読フィード一覧

### デザイン・アート

| フィード | 説明 |
|---|---|
| [Dezeen](https://www.dezeen.com/) | 建築・インテリア・プロダクトデザイン |
| [Core77](https://www.core77.com/) | インダストリアルデザイン |
| [Design Milk](https://design-milk.com/) | モダンデザイン |
| [Creative Bloq](https://www.creativebloq.com/) | アート・デザイン全般 |
| [AXIS](https://www.axismag.jp/) | デザイン・建築・ビジネス（日本語） |

### 日本のオープンデータ

[awesome-japan-opendata](https://github.com/japan-opendata/awesome-japan-opendata) を参考にまとめたオープンデータ系フィードです。

政府のオープンデータカタログは data.go.jp から
[e-Gov データポータル](https://data.e-gov.go.jp/)（data.e-gov.go.jp）へ移転しました。
省庁は `org_XXXX` 形式のコードで識別されます。コードと省庁名の対応は
`https://data.e-gov.go.jp/data/api/action/organization_list?all_fields=true` で確認できます。

| フィード | 説明 |
|---|---|
| [e-Gov データポータル](https://data.e-gov.go.jp/) | 日本政府オープンデータカタログ（全省庁） |
| 国土交通省 | e-Gov データポータル 国土交通省新着（`org_1900`） |
| 内閣府 | e-Gov データポータル 内閣府新着（`org_0400`） |
| 厚生労働省 | e-Gov データポータル 厚生労働省新着（`org_1600`） |
| 文部科学省 | e-Gov データポータル 文部科学省新着（`org_1500`） |
| 財務省 | e-Gov データポータル 財務省新着（`org_1400`） |
| 農林水産省 | e-Gov データポータル 農林水産省新着（`org_1700`） |
| 経済産業省 | e-Gov データポータル 経済産業省新着（`org_1800`） |
| 環境省 | e-Gov データポータル 環境省新着（`org_2000`） |
| 警察庁 | e-Gov データポータル 警察庁新着（`org_0700`） |
| [デジタル庁](https://www.digital.go.jp/) | デジタル庁 新着情報 |
| [JIRCAS](https://www.jircas.go.jp/) | 国際農林水産業研究センター |

> **省庁別フィードの表示件数について**  
> osmosfeed は各記事の日付として Atom の `<published>`（＝データセットの初回公開日）を使います。
> e-Gov データポータルのフィードには `<updated>`（メタデータ更新日）も含まれますが、
> 更新されるのは大半が数年前に公開済みのデータセットのため、`cacheMaxDays: 30` の範囲には入りません。
> 新規公開されるデータセットは全省庁合わせて月に数件程度で、省庁によっては数か月間ゼロになります。
> 省庁別フィードが空欄でもフィード自体は正常です。件数を稼ぎたい場合は全省庁フィードのみでも内容は同じです。

### 配信終了により削除したフィード

| フィード | 理由 |
|---|---|
| Dexigner | サイト自体が2022年9月で更新停止。フィードも同時点から更新なし |
| e-Stat | [RSSによる新着情報配信サービスが2023年9月30日で終了](https://www.e-stat.go.jp/rss) |
| CODH | サイトがRSS/Atomフィードを提供していない |

## PWA（ホーム画面へのインストール）

このサイトはPWAとして動作します。スマートフォンやデスクトップのブラウザから
「ホーム画面に追加」「アプリをインストール」でスタンドアロンアプリとして起動できます。

- オフラインでも最後に読み込んだ記事一覧を閲覧できます
- 記事一覧は表示のたびにネットワークを優先して取得するため、常に最新が表示されます
  （取得に失敗した場合のみキャッシュにフォールバック）
- 新しいビルドが公開されると、次回起動時に自動で更新されます

関連ファイル:

| ファイル | 役割 |
|---|---|
| [`static/manifest.webmanifest`](./static/manifest.webmanifest) | アプリ名・アイコン・表示モードの定義 |
| [`static/sw.js`](./static/sw.js) | Service Worker（キャッシュ戦略） |
| [`static/index.js`](./static/index.js) | Service Worker の登録 |
| `static/icon-*.png`, `static/apple-touch-icon.png` | アプリアイコン |

アイコンを差し替える場合は `static/` 配下のPNGを置き換えてください
（192x192 / 512x512 / マスカブル512x512 / Apple用180x180）。

## フィードの追加・変更方法

[`osmosfeed.yaml`](./osmosfeed.yaml) の `sources` にフィードURLを追加するだけです。

```yaml
sources:
  - href: https://example.com/feed.rss # コメントで説明を記載
```

mainブランチにpushすると GitHub Actions が自動実行され、サイトが更新されます。  
手動で実行したい場合は [Actions タブ](../../actions/workflows/update-feed.yaml) から「Run workflow」を押してください。

## 参考

- [osmosfeed ドキュメント](https://github.com/osmoscraft/osmosfeed)
- [awesome-japan-opendata](https://github.com/japan-opendata/awesome-japan-opendata)

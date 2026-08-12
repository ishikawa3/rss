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
| [Dexigner](https://www.dexigner.com/) | デザインニュース |
| [Design Milk](https://design-milk.com/) | モダンデザイン |
| [Creative Bloq](https://www.creativebloq.com/) | アート・デザイン全般 |

### 日本のオープンデータ

[awesome-japan-opendata](https://github.com/japan-opendata/awesome-japan-opendata) を参考にまとめたオープンデータ系フィードです。

| フィード | 説明 |
|---|---|
| [DATA GO JP](https://www.data.go.jp/) | 日本政府オープンデータカタログ（全省庁） |
| [国土交通省](https://www.data.go.jp/) | data.go.jp 国土交通省新着 |
| [内閣府](https://www.data.go.jp/) | data.go.jp 内閣府新着 |
| [厚生労働省](https://www.data.go.jp/) | data.go.jp 厚生労働省新着 |
| [文部科学省](https://www.data.go.jp/) | data.go.jp 文部科学省新着 |
| [財務省](https://www.data.go.jp/) | data.go.jp 財務省新着 |
| [農林水産省](https://www.data.go.jp/) | data.go.jp 農林水産省新着 |
| [経済産業省](https://www.data.go.jp/) | data.go.jp 経済産業省新着 |
| [環境省](https://www.data.go.jp/) | data.go.jp 環境省新着 |
| [警察庁](https://www.data.go.jp/) | data.go.jp 警察庁新着 |
| [デジタル庁](https://www.digital.go.jp/) | デジタル庁 新着情報 |
| [e-Stat](https://www.e-stat.go.jp/) | 政府統計の総合窓口 |
| [CODH](https://codh.rois.ac.jp/) | ROIS-DS 人文学オープンデータ共同利用センター |
| [JIRCAS](https://www.jircas.go.jp/) | 国際農林水産業研究センター |

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

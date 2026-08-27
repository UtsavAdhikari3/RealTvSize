import type { Translation } from './types';

const ja = {
	languageName: '日本語',
	pageTitles: {
		home: 'RealTVSize', compare: 'テレビサイズを比較 | RealTVSize', viewingDistance: '視聴距離 | RealTVSize', findMyTvSize: '最適なテレビサイズを探す | RealTVSize', about: '私たちについて | RealTVSize', contact: 'お問い合わせ | RealTVSize', privacyPolicy: 'プライバシーポリシー | RealTVSize', termsAndConditions: '利用規約 | RealTVSize',
	},
	common: {
		skipToContent: '本文へ移動', degrees: '°', inchSymbol: '″', inchesShort: 'インチ', feetShort: 'ft', squareInchesShort: '平方インチ', separator: '·',
	},
	navigation: {
		primaryLabel: 'メインナビゲーション', footerLabel: 'フッターナビゲーション', home: 'ホーム', compare: 'テレビサイズを比較', viewingDistance: '視聴距離', findMyTvSize: '最適なテレビサイズを探す', about: '私たちについて', contact: 'お問い合わせ', privacyPolicy: 'プライバシー', termsAndConditions: '利用規約', more: 'その他', language: '言語', homeAria: 'RealTVSize ホーム',
	},
	theme: { switchToDark: 'ダークモードに切り替える', switchToLight: 'ライトモードに切り替える' },
	footer: {
		tagline: '部屋に置く前に、画面の大きさを確かめましょう。', copyright: '© 2026 RealTVSize', disclaimer: '寸法は16:9ディスプレイを前提とし、ベゼル幅は含みません。',
	},
	profiles: {
		veryImmersive: { label: '非常に没入感が高い', message: '間近で見る、非常に没入感の高い映像' },
		immersive: { label: '没入型', message: '映画館のような没入感' },
		balanced: { label: 'バランス型', message: 'さまざまなコンテンツに適したバランスのよい視聴感' },
		relaxed: { label: 'リラックス型', message: 'ゆったりと気軽に楽しめる視聴感' },
		distant: { label: '遠め', message: 'この距離ではテレビが小さく感じられる可能性があります' },
	},
	simulation: {
		roomAria: '{size}インチのテレビを{distance}フィート離れて視聴。水平視野角は{fov}度です',
		povAria: '{distance}フィート離れた位置から見た{size}インチテレビ。水平視野の{fov}度を占めます',
		tvAria: '{label}、{size}インチの16:9テレビ', simulatedTv: 'シミュレーション上のテレビ', viewpointTv: '視聴位置から見たテレビ', fieldOfView: '視野角 {fov}°', screenPlane: '画面位置', eyePosition: '目の位置', yourView: '視聴位置からの見え方', viewDescription: 'ソファから見たおおよその画面サイズ',
	},
	comparison: {
		eyebrow: '実寸比で比較', heading: '次のテレビが本当はどれほど大きいか確認できます。', intro: '2台の画面を同じ実寸比で比較。広告用の縮小画像ではなく、正確な16:9の寸法で表示します。', studio: 'スクリーンスタジオ', studioDescription: '2台のテレビを同じ縮尺で表示', popularComparisons: 'よく使われる比較', versus: '対', firstTv: '1台目のテレビ', secondTv: '2台目のテレビ', tvA: 'TV A', tvB: 'TV B', width: '幅', resultsLabel: 'テレビ比較の結果', diagonalDifference: '対角線の差', widthDifference: '幅の差', heightDifference: '高さの差', areaIncrease: '画面面積の増加率', screenAreaDifference: '画面面積の差', heightPair: '高さ：TV A / TV B', liveResult: '{sizeA}インチと{sizeB}インチを比較。大きい画面は面積が{increase}パーセント広くなります。',
	},
	viewingDistance: {
		eyebrow: '視聴距離シミュレーター', heading: 'ソファを動かして、見え方の違いを体感。', intro: '距離は、見え方と合わせて初めて実感できます。テレビを設定し、映画館のような位置からゆったりした位置まで動かしてみましょう。', yourSetup: '現在の設定', initialFeel: 'バランスのよい視野角', tvSize: 'テレビサイズ', couchDistance: 'ソファまでの距離', jumpToStyle: '視聴スタイルを選択', positionsLabel: '推奨視聴位置', immersiveResult: '没入型 · 視野角40°', balancedResult: 'バランス型 · 視野角30°', relaxedResult: 'リラックス型 · 視野角25°', immersiveNote: '映画館のような迫力。4Kの細部に最適', balancedNote: 'さまざまな映像を快適に視聴', relaxedNote: '気軽にゆったり視聴', feel: '{profile} · 視野角 {fov}°', liveResult: '{size}インチのテレビを{distance}フィート離れて視聴。視野角は{fov}度です。{message}。',
	},
	recommender: {
		eyebrow: 'テレビサイズのおすすめ', heading: '部屋から考えて、最適な画面を見つけましょう。', intro: 'ソファの位置を指定してください。没入型、バランス型、リラックス型を切り替えると、部屋の中のテレビが実寸比で変化します。', basis: '視野角に基づく推奨', myCouchIs: 'ソファはテレビから', feetFromTv: 'フィートの位置', viewingDistance: '視聴距離', chooseStyle: '視聴スタイルを選択', stylesLabel: 'テレビサイズの推奨スタイル', immersiveDetail: '映画館のような視野角40°', balancedDetail: '普段使いに最適な視野角30°', relaxedDetail: '気軽に見られる視野角25°', recommendedTv: 'おすすめのテレビ', inches: 'インチ', initialMode: 'バランス型の視聴', recommendedSize: 'おすすめサイズ', reasonableRange: '適正範囲', fieldOfView40: '視野角40°', fieldOfView30: '視野角30°', fieldOfView25: '視野角25°', modeLabel: '{mode} · 視野角 {fov}°', liveResult: '視聴距離{distance}フィートでは、{size}インチのテレビが{mode}のおすすめです。視野角は{fov}度です。{message}。',
	},
	home: {
		whyEyebrow: '可視化が重要な理由', whyHeading: '対角線のインチ数だけでは、本当の差はわかりません。', whyIntro: 'テレビサイズは画面の角から角までを測ります。幅と高さの両方が大きくなるため、画面面積は対角線の数字から想像する以上に増えます。', geometryTitle: '正確な16:9の寸法', geometryText: 'ピタゴラスの定理を使い、対角線から幅と高さを直接計算します。', scaleTitle: '共通の表示スケール', scaleText: 'すべての比較で同じ縮尺を使うため、85インチテレビが見た目にも数値上にも大きいことがわかります。', fovTitle: '視野角の目安', fovText: '40°、30°、25°の目安から、映画館のような迫力か、ゆったりした見え方かを確認できます。',
	},
} satisfies Translation;

export default ja;

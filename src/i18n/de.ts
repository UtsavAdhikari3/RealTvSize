import type { Translation } from './types';

const de = {
	languageName: 'Deutsch',
	pageTitles: {
		home: 'RealTVSize',
		compare: 'TV-Größen vergleichen | RealTVSize',
		viewingDistance: 'Sitzabstand | RealTVSize',
		findMyTvSize: 'Meine TV-Größe finden | RealTVSize',
		about: 'Über uns | RealTVSize',
		contact: 'Kontakt | RealTVSize',
		privacyPolicy: 'Datenschutzerklärung | RealTVSize',
		termsAndConditions: 'Allgemeine Geschäftsbedingungen | RealTVSize',
	},
	common: {
		skipToContent: 'Zum Inhalt springen', degrees: '°', inchSymbol: '″', inchesShort: 'Zoll', feetShort: 'ft', squareInchesShort: 'Quadratzoll', separator: '·',
	},
	navigation: {
		primaryLabel: 'Hauptnavigation', footerLabel: 'Fußzeilennavigation', home: 'Startseite', compare: 'TV-Größen vergleichen', viewingDistance: 'Sitzabstand', findMyTvSize: 'Meine TV-Größe finden', about: 'Über uns', contact: 'Kontakt', privacyPolicy: 'Datenschutz', termsAndConditions: 'AGB', more: 'Mehr', language: 'Sprache', homeAria: 'RealTVSize-Startseite',
	},
	theme: { switchToDark: 'Zum dunklen Modus wechseln', switchToLight: 'Zum hellen Modus wechseln' },
	footer: {
		tagline: 'Sieh den Bildschirm, bevor er ins Zimmer kommt.', copyright: '© 2026 RealTVSize', disclaimer: 'Die Maße gehen von einem 16:9-Display aus und schließen die Rahmenbreite aus.',
	},
	profiles: {
		veryImmersive: { label: 'Sehr immersiv', message: 'Eine sehr immersive Ansicht aus nächster Nähe' },
		immersive: { label: 'Immersiv', message: 'Kinoreif und immersiv' },
		balanced: { label: 'Ausgewogen', message: 'Eine ausgewogene Ansicht für gemischte Inhalte' },
		relaxed: { label: 'Entspannt', message: 'Eine entspannte, angenehme Ansicht' },
		distant: { label: 'Weit entfernt', message: 'Dieser Fernseher könnte bei diesem Abstand klein wirken' },
	},
	simulation: {
		roomAria: '{size}-Zoll-Fernseher aus {distance} Fuß Entfernung mit einem horizontalen Sichtfeld von {fov} Grad',
		povAria: 'Deine Ansicht eines {size}-Zoll-Fernsehers aus {distance} Fuß Entfernung, der {fov} Grad des horizontalen Sichtfelds ausfüllt',
		tvAria: '{label}, {size}-Zoll-Fernseher im Format 16:9', simulatedTv: 'Simulierter Fernseher', viewpointTv: 'Fernseher aus deiner Perspektive', fieldOfView: '{fov}° Sichtfeld', screenPlane: 'Bildschirmebene', eyePosition: 'Augenposition', yourView: 'Deine Ansicht', viewDescription: 'Ungefähre Bildschirmgröße vom Sofa aus',
	},
	comparison: {
		eyebrow: 'Maßstabsgetreuer Vergleich', heading: 'So groß ist dein nächster Fernseher wirklich.', intro: 'Vergleiche zwei Bildschirme im selben physischen Maßstab – mit exakten 16:9-Maßen statt Marketing-Miniaturen.', studio: 'Bildschirmstudio', studioDescription: 'Beide Fernseher verwenden denselben Maßstab', popularComparisons: 'Beliebte Vergleiche', versus: 'vs.', firstTv: 'Erster Fernseher', secondTv: 'Zweiter Fernseher', tvA: 'TV A', tvB: 'TV B', width: 'BREITE', resultsLabel: 'Ergebnisse des TV-Vergleichs', diagonalDifference: 'Diagonalenunterschied', widthDifference: 'Breitenunterschied', heightDifference: 'Höhenunterschied', areaIncrease: 'Flächenzuwachs', screenAreaDifference: 'Bildflächenunterschied', heightPair: 'Höhe: TV A / TV B', liveResult: '{sizeA} Zoll gegenüber {sizeB} Zoll. Der größere Bildschirm hat {increase} Prozent mehr Fläche.',
	},
	viewingDistance: {
		eyebrow: 'Sitzabstand-Simulator', heading: 'Verschiebe das Sofa. Spüre den Unterschied.', intro: 'Ein Abstand wird erst anschaulich, wenn du ihn sehen kannst. Lege deinen Fernseher fest und wechsle zwischen kinoreifen und entspannten Positionen.', yourSetup: 'Deine Einrichtung', initialFeel: 'Ausgewogenes Sichtfeld', tvSize: 'TV-Größe', couchDistance: 'Sofaabstand', jumpToStyle: 'Zu einem Ansichtsstil springen', positionsLabel: 'Empfohlene Sitzpositionen', immersiveResult: 'Immersiv · 40° Sichtfeld', balancedResult: 'Ausgewogen · 30° Sichtfeld', relaxedResult: 'Entspannt · 25° Sichtfeld', immersiveNote: 'Kinoreif, ideal für 4K-Details', balancedNote: 'Angenehm für gemischte Inhalte', relaxedNote: 'Locker und entspannt', feel: '{profile} · {fov}° Sichtfeld', liveResult: '{size}-Zoll-Fernseher aus {distance} Fuß Entfernung mit einem Sichtfeld von {fov} Grad. {message}.',
	},
	recommender: {
		eyebrow: 'TV-Größenempfehlung', heading: 'Beginne mit dem Raum. Finde den Bildschirm.', intro: 'Gib an, wo das Sofa steht. Der Fernseher skaliert im Raum, während du zwischen immersiver, ausgewogener und entspannter Ansicht wechselst.', basis: 'Basierend auf dem Sichtfeld', myCouchIs: 'Mein Sofa ist', feetFromTv: 'Fuß vom Fernseher entfernt', viewingDistance: 'Sitzabstand', chooseStyle: 'Wähle deinen Ansichtsstil', stylesLabel: 'Stil der TV-Größenempfehlung', immersiveDetail: '40°-Kinoansicht', balancedDetail: '30°-Idealbereich für den Alltag', relaxedDetail: '25°-Ansicht für entspanntes Fernsehen', recommendedTv: 'Empfohlener Fernseher', inches: 'Zoll', initialMode: 'Ausgewogene Ansicht', recommendedSize: 'Empfohlene Größe', reasonableRange: 'Sinnvoller Bereich', fieldOfView40: '40° Sichtfeld', fieldOfView30: '30° Sichtfeld', fieldOfView25: '25° Sichtfeld', modeLabel: '{mode} · {fov}° Sichtfeld', liveResult: 'Bei {distance} Fuß ist ein {size}-Zoll-Fernseher die {mode} Empfehlung mit einem Sichtfeld von {fov} Grad. {message}.',
	},
	home: {
		whyEyebrow: 'Warum Visualisierung wichtig ist', whyHeading: 'Die Zollangabe der Diagonale verbirgt den echten Unterschied.', whyIntro: 'TV-Größen werden von Ecke zu Ecke gemessen. Weil Breite und Höhe wachsen, nimmt die Bildschirmfläche viel schneller zu, als die Diagonale vermuten lässt.', geometryTitle: 'Echte 16:9-Geometrie', geometryText: 'Breite und Höhe werden mit dem Satz des Pythagoras direkt aus der Diagonale berechnet.', scaleTitle: 'Gemeinsamer visueller Maßstab', scaleText: 'Jeder Vergleich nutzt denselben Maßstab. So ist ein 85-Zoll-Fernseher sichtbar und mathematisch größer.', fovTitle: 'Sichtfeld-Empfehlungen', fovText: 'Zielwerte von 40°, 30° und 25° zeigen, wie kinoreif oder entspannt sich eine Sitzposition anfühlt.',
	},
} satisfies Translation;

export default de;

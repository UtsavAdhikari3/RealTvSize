import type { Translation } from './types';

const fr = {
	languageName: 'Français',
	pageTitles: {
		home: 'RealTVSize', compare: 'Comparer les tailles de TV | RealTVSize', viewingDistance: 'Distance de visionnage | RealTVSize', findMyTvSize: 'Trouver ma taille de TV | RealTVSize', about: 'À propos | RealTVSize', contact: 'Nous contacter | RealTVSize', privacyPolicy: 'Politique de confidentialité | RealTVSize', termsAndConditions: 'Conditions générales | RealTVSize',
	},
	common: {
		skipToContent: 'Aller au contenu', degrees: '°', inchSymbol: '″', inchesShort: 'po', feetShort: 'pi', squareInchesShort: 'po²', separator: '·',
	},
	navigation: {
		primaryLabel: 'Navigation principale', footerLabel: 'Navigation du pied de page', home: 'Accueil', compare: 'Comparer les tailles de TV', viewingDistance: 'Distance de visionnage', findMyTvSize: 'Trouver ma taille de TV', about: 'À propos', contact: 'Nous contacter', privacyPolicy: 'Confidentialité', termsAndConditions: 'Conditions générales', more: 'Plus', language: 'Langue', homeAria: 'Accueil RealTVSize',
	},
	theme: { switchToDark: 'Passer au mode sombre', switchToLight: 'Passer au mode clair' },
	footer: {
		tagline: "Voyez l’écran avant qu’il n’entre dans la pièce.", copyright: '© 2026 RealTVSize', disclaimer: "Les dimensions supposent un écran 16:9 et n’incluent pas la largeur du cadre.",
	},
	profiles: {
		veryImmersive: { label: 'Très immersif', message: 'Une vue rapprochée très immersive' },
		immersive: { label: 'Immersif', message: 'Une expérience immersive digne du cinéma' },
		balanced: { label: 'Équilibré', message: 'Une vue équilibrée pour des contenus variés' },
		relaxed: { label: 'Détendu', message: 'Une vue détendue et confortable' },
		distant: { label: 'Éloigné', message: 'Ce téléviseur peut sembler petit à cette distance' },
	},
	simulation: {
		roomAria: 'Téléviseur de {size} pouces regardé à {distance} pieds, avec un champ de vision horizontal de {fov} degrés',
		povAria: 'Votre vue d’un téléviseur de {size} pouces à {distance} pieds, occupant {fov} degrés de vision horizontale',
		tvAria: '{label}, téléviseur 16:9 de {size} pouces', simulatedTv: 'TV simulée', viewpointTv: 'TV depuis votre point de vue', fieldOfView: 'champ de vision de {fov}°', screenPlane: "Plan de l’écran", eyePosition: 'Position des yeux', yourView: 'Votre vue', viewDescription: 'Taille approximative de l’écran depuis le canapé',
	},
	comparison: {
		eyebrow: 'Comparaison à l’échelle réelle', heading: 'Voyez la taille réelle de votre prochain téléviseur.', intro: 'Comparez deux écrans à la même échelle physique : des dimensions 16:9 précises, pas des miniatures publicitaires.', studio: 'Studio d’écrans', studioDescription: 'Les deux téléviseurs utilisent la même échelle', popularComparisons: 'Comparaisons populaires', versus: 'vs', firstTv: 'Premier téléviseur', secondTv: 'Deuxième téléviseur', tvA: 'TV A', tvB: 'TV B', width: 'LARGEUR', resultsLabel: 'Résultats de la comparaison des téléviseurs', diagonalDifference: 'Écart de diagonale', widthDifference: 'Écart de largeur', heightDifference: 'Écart de hauteur', areaIncrease: 'Gain de surface', screenAreaDifference: 'Écart de surface d’écran', heightPair: 'Hauteur : TV A / TV B', liveResult: '{sizeA} pouces contre {sizeB} pouces. Le plus grand écran offre {increase} pour cent de surface en plus.',
	},
	viewingDistance: {
		eyebrow: 'Simulateur de distance de visionnage', heading: 'Déplacez le canapé. Ressentez la différence.', intro: 'Une distance ne prend tout son sens que lorsqu’on peut la voir. Choisissez votre TV, puis passez d’une position cinéma à une position décontractée.', yourSetup: 'Votre installation', initialFeel: 'Champ de vision équilibré', tvSize: 'Taille du téléviseur', couchDistance: 'Distance du canapé', jumpToStyle: 'Aller à un style de visionnage', positionsLabel: 'Positions de visionnage recommandées', immersiveResult: 'Immersif · Champ de vision de 40°', balancedResult: 'Équilibré · Champ de vision de 30°', relaxedResult: 'Détendu · Champ de vision de 25°', immersiveNote: 'Digne du cinéma, idéal pour les détails 4K', balancedNote: 'Confortable pour des contenus variés', relaxedNote: 'Décontracté et facile à regarder', feel: '{profile} · champ de vision de {fov}°', liveResult: 'Téléviseur de {size} pouces à {distance} pieds, avec un champ de vision de {fov} degrés. {message}.',
	},
	recommender: {
		eyebrow: 'Recommandation de taille de TV', heading: 'Partez de la pièce. Trouvez l’écran.', intro: 'Indiquez la position du canapé. Le téléviseur change d’échelle dans la pièce lorsque vous passez d’une vue immersive à une vue équilibrée ou détendue.', basis: 'Basé sur le champ de vision', myCouchIs: 'Mon canapé est à', feetFromTv: 'pieds du téléviseur', viewingDistance: 'Distance de visionnage', chooseStyle: 'Choisissez votre style de visionnage', stylesLabel: 'Style de recommandation de taille de TV', immersiveDetail: 'Vue cinéma à 40°', balancedDetail: 'Zone idéale de 30° au quotidien', relaxedDetail: 'Visionnage décontracté à 25°', recommendedTv: 'TV recommandée', inches: 'pouces', initialMode: 'Visionnage équilibré', recommendedSize: 'Taille recommandée', reasonableRange: 'Plage raisonnable', fieldOfView40: 'Champ de vision de 40°', fieldOfView30: 'Champ de vision de 30°', fieldOfView25: 'Champ de vision de 25°', modeLabel: '{mode} · champ de vision de {fov}°', liveResult: 'À {distance} pieds, un téléviseur de {size} pouces est la recommandation {mode}, avec un champ de vision de {fov} degrés. {message}.',
	},
	home: {
		whyEyebrow: 'Pourquoi la visualisation est importante', whyHeading: 'La diagonale en pouces masque la véritable différence.', whyIntro: 'Les téléviseurs sont mesurés d’un coin à l’autre. Comme la largeur et la hauteur augmentent toutes deux, la surface de l’écran croît bien plus vite que la diagonale ne le laisse penser.', geometryTitle: 'Géométrie 16:9 réelle', geometryText: 'La largeur et la hauteur sont calculées directement à partir de la diagonale grâce au théorème de Pythagore.', scaleTitle: 'Échelle visuelle commune', scaleText: 'Chaque comparaison utilise la même échelle : un téléviseur de 85 pouces est donc visiblement et mathématiquement plus grand.', fovTitle: 'Repères de champ de vision', fovText: 'Les objectifs de 40°, 30° et 25° montrent si une position semblera cinématographique ou détendue.',
	},
} satisfies Translation;

export default fr;

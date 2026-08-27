export interface StaticPageSection {
	heading: string;
	paragraphs?: string[];
	items?: string[];
	showEmail?: boolean;
}

export interface StaticPageContent {
	eyebrow: string;
	description: string;
	intro: string;
	updated?: string;
	sections: StaticPageSection[];
	contactEmail?: string;
}

export const staticPages = {
	about: {
		eyebrow: 'About RealTVSize',
		description: 'Learn why RealTVSize was created and how its free TV comparison, viewing-distance, and room-size tools work.',
		intro: 'RealTVSize turns abstract screen measurements into something you can see, compare, and use before buying a television.',
		sections: [
			{
				heading: 'Why we built it',
				paragraphs: [
					'A diagonal measurement alone does not show how much wall space a TV uses or how large it will feel from the sofa. RealTVSize was built to make those differences visible before a screen reaches your room.',
					'Our tools combine true 16:9 screen geometry with viewing-angle calculations, helping you compare sizes and explore comfortable viewing distances without sales pressure.',
				],
			},
			{
				heading: 'What you can do here',
				items: [
					'Compare two TV sizes at the same visual scale.',
					'Preview how a screen may feel from different seating distances.',
					'Find a practical TV-size range based on your room and viewing preference.',
					'Check approximate 16:9 screen width, height, and area.',
				],
			},
			{
				heading: 'Independent and practical',
				paragraphs: [
					'RealTVSize is a free planning tool. We do not sell televisions, rank brands, or replace an in-room measurement. Recommendations are starting points, so always confirm the dimensions of a specific model—including its bezel and stand—before purchasing.',
				],
			},
		],
	} satisfies StaticPageContent,
	contact: {
		eyebrow: 'Get in touch',
		description: 'Contact RealTVSize with feedback, corrections, accessibility issues, or questions about the TV-size tools.',
		intro: 'Found something we can improve, have a question about a calculation, or want to report an accessibility issue? We would like to hear from you.',
		contactEmail: 'contact@realtvsize.com',
		sections: [
			{
				heading: 'Email us',
				showEmail: true,
				paragraphs: [
					'Use the email address below for product feedback, corrections, partnership questions, or general support. Please include the page you were using, your device or browser when relevant, and enough detail for us to reproduce the issue.',
				],
			},
			{
				heading: 'Helpful details to include',
				items: [
					'The URL or tool you were using.',
					'The TV size, distance, or settings involved.',
					'What you expected and what happened instead.',
					'A screenshot, if it helps explain the issue.',
				],
			},
			{
				heading: 'Privacy note',
				paragraphs: [
					'Please do not send passwords, payment information, government identification numbers, or other sensitive personal data. Information you send by email will be used to respond to your message and maintain necessary correspondence.',
				],
			},
		],
	} satisfies StaticPageContent,
	privacyPolicy: {
		eyebrow: 'Legal',
		description: 'Read the RealTVSize privacy policy, including what information the site uses, browser storage, hosting logs, and your choices.',
		intro: 'This policy explains how RealTVSize handles information when you use our website and free TV-planning tools.',
		updated: 'Effective August 27, 2026',
		contactEmail: 'contact@realtvsize.com',
		sections: [
			{
				heading: 'Information you provide',
				paragraphs: [
					'You can use the calculators without creating an account or submitting personal information. If you email us, we receive the information you choose to include, such as your name, email address, and message.',
				],
			},
			{
				heading: 'Information used by the website',
				paragraphs: [
					'The calculator inputs you enter are processed in your browser to update the visualizations. RealTVSize does not currently provide accounts, advertising trackers, or an on-site contact form.',
					'Like most websites, our hosting provider may process standard technical logs needed to deliver and protect the site. These can include an IP address, browser type, requested URL, referring page, and request time. Retention and handling of these logs depend on the hosting provider we use.',
				],
			},
			{
				heading: 'Browser storage',
				paragraphs: [
					'RealTVSize stores your light or dark theme preference in your browser using local storage. This setting stays on your device until you clear site data or change it. We do not use this preference to identify you.',
				],
			},
			{
				heading: 'How information is used',
				items: [
					'Operate, secure, troubleshoot, and improve the website.',
					'Respond to messages and support requests.',
					'Prevent misuse and comply with applicable legal obligations.',
				],
			},
			{
				heading: 'Sharing and retention',
				paragraphs: [
					'We do not sell personal information. Information may be processed by service providers that help host the website or deliver email, and may be disclosed when required by law or necessary to protect rights, safety, and site security.',
					'We retain correspondence only as long as reasonably necessary for the purpose it was collected, to maintain business records, or to meet legal obligations.',
				],
			},
			{
				heading: 'Your choices and policy changes',
				paragraphs: [
					'You can clear local storage through your browser settings and can choose not to email us. Depending on where you live, you may also have rights relating to personal information you have provided. Contact us to make a request.',
					'We may update this policy as the site changes. The effective date above will be revised when material updates are published.',
				],
			},
		],
	} satisfies StaticPageContent,
	termsAndConditions: {
		eyebrow: 'Legal',
		description: 'Read the terms and conditions for using the RealTVSize website, calculators, visualizations, and recommendations.',
		intro: 'These terms govern your use of RealTVSize. By using the website, you agree to these terms.',
		updated: 'Effective August 27, 2026',
		contactEmail: 'contact@realtvsize.com',
		sections: [
			{
				heading: 'Use of the website',
				paragraphs: [
					'RealTVSize provides free informational tools for comparing TV dimensions, viewing distances, and room-based size recommendations. You may use the website for lawful personal or commercial research, provided you do not disrupt the service, attempt unauthorized access, or misuse its content or functionality.',
				],
			},
			{
				heading: 'Estimates, not professional advice',
				paragraphs: [
					'Calculations and visualizations are estimates based on the values you enter, standard 16:9 geometry, and general viewing-angle conventions. Actual television dimensions, room conditions, eyesight, content, mounting requirements, and personal comfort vary.',
					'Always verify the manufacturer’s dimensions and installation requirements before buying or mounting a TV. You remain responsible for purchasing, placement, mounting, electrical, and safety decisions.',
				],
			},
			{
				heading: 'Intellectual property',
				paragraphs: [
					'The website’s branding, original text, design, graphics, software, and other original content are owned by RealTVSize or its licensors and are protected by applicable intellectual-property laws. These terms do not transfer ownership to you.',
				],
			},
			{
				heading: 'Availability and third-party services',
				paragraphs: [
					'We may change, suspend, or discontinue any part of the website without notice. The site may rely on hosting, email, or other third-party services. We are not responsible for third-party websites, services, terms, or privacy practices.',
				],
			},
			{
				heading: 'Disclaimers and limitation of liability',
				paragraphs: [
					'To the extent permitted by law, the website is provided “as is” and “as available,” without warranties of accuracy, availability, fitness for a particular purpose, or non-infringement.',
					'To the extent permitted by law, RealTVSize will not be liable for indirect, incidental, special, consequential, or punitive damages, or for losses arising from reliance on the tools, inability to use the site, or purchases and installations based on its estimates. Nothing in these terms excludes liability that cannot legally be excluded.',
				],
			},
			{
				heading: 'Changes to these terms',
				paragraphs: [
					'We may update these terms from time to time. Continued use after updated terms are published means you accept the revised terms. If you do not agree, stop using the website.',
				],
			},
		],
	} satisfies StaticPageContent,
} as const;

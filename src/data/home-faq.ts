export interface FaqItem {
	question: string;
	answer: string;
}

export const homeFaqs = [
	{
		question: 'How do I calculate what size TV I should get?',
		answer:
			'Measure the straight-line distance from your usual eye position to the screen, then choose how immersive you want the picture to feel. A wider field of view calls for a larger TV, while relaxed viewing calls for a smaller one. Enter your distance in the TV size calculator to compare immersive, balanced, and relaxed recommendations, then confirm that the television’s full cabinet dimensions fit your wall or stand.',
	},
	{
		question: 'How big is a 42 inch TV in cm?',
		answer:
			'A 42-inch TV has a 106.7 cm diagonal because one inch equals 2.54 cm. A standard 16:9 42-inch screen is approximately 93.0 cm wide and 52.3 cm high. These are screen measurements only; the television’s bezel, feet, and stand can make its overall dimensions larger.',
	},
	{
		question: 'How big is a 32 inch TV?',
		answer:
			'A 32-inch TV measures 32 inches, or 81.3 cm, diagonally. For a standard 16:9 display, the visible screen is approximately 27.9 inches (70.8 cm) wide and 15.7 inches (39.8 cm) high. Check the manufacturer’s product dimensions when you need the exact width and height including the bezel and stand.',
	},
	{
		question: 'What are standard TV sizes?',
		answer:
			'Common TV sizes include 24, 32, 40, 42, 43, 48, 50, 55, 65, 75, 77, 83, 85, and 98 inches. Availability varies by brand and display technology. The best choice is not simply the most common size; it should also match your viewing distance, preferred field of view, room layout, and available mounting space.',
	},
	{
		question: 'Which size TV is best for home?',
		answer:
			'There is no single best TV size for every home. A living-room TV usually needs to be larger than a bedroom TV because the seating is farther away. Measure your actual viewing distance and use the balanced recommendation as a practical starting point. Choose the immersive option for movies and gaming, or the relaxed option if you prefer a less dominant screen.',
	},
	{
		question: 'How is TV size measured?',
		answer:
			'TV size is measured diagonally across the visible screen, from one corner to the opposite corner. The advertised size does not normally include the bezel or frame. Most modern televisions use a 16:9 aspect ratio, so two TVs with the same diagonal usually have similar screen width and height even when their external cabinet dimensions differ.',
	},
	{
		question: 'Can we measure online?',
		answer:
			'Yes. An online TV size calculator can estimate screen width, height, area, viewing angle, and a suitable diagonal from your viewing distance. It can also compare two TVs at the same scale. For final installation planning, verify the online result with a tape measure and check the manufacturer’s full product dimensions, including the stand and bezel.',
	},
	{
		question: 'Should I buy a 32 or 40 inch TV?',
		answer:
			'Choose a 32-inch TV for a compact room, desk, kitchen, or close viewing position where space matters. Choose a 40-inch TV when you sit farther away or want a more immersive picture. A 40-inch 16:9 screen has about 56% more display area than a 32-inch screen, so the difference is more noticeable than the eight-inch diagonal increase suggests.',
	},
	{
		question: 'Is a 42 inch TV too small?',
		answer:
			'A 42-inch TV is not automatically too small. It can work well in a bedroom, apartment, or smaller living space with a relatively close seat. It may feel small from a long viewing distance or when you want a cinema-like experience. Use your couch distance and preferred viewing style to compare 42 inches with the next common sizes before deciding.',
	},
] as const satisfies readonly FaqItem[];

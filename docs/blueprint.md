# **App Name**: KIBI Sponsorship Matchmaker

## Core Features:

- Brand Brief Submission: Allow brands to submit a structured campaign brief with key details such as industry, objectives, geography, sports preferences, target audience, budget, timeline, and deliverables.
- Instant Athlete/League/Venue Recommendations: Provide instant teaser recommendations for Athletes, Leagues, and Venues based on the submitted brief, showcasing minimal fields only (name, sport, location).
- Recommendation Engine: Apply rules and weighted scoring based on sport, geography, objective fit, and featured status to rank and prioritize the most relevant sponsorship opportunities. The LLM will use rules and weights from a config table to make recommendations based on various inputs. It acts as a tool to process available assets and pick the right selection based on parameters defined in a configuration file. Weights in the configuration file affect the match results.
- Data Source Integration: Integrate with Google Sheets or a database to source athlete, league, and venue data, ensuring data normalization, cleaning, and deduplication.
- Lead Generation and Notification: Capture brief details as a lead and notify the Sponsorship team for follow-up actions via Slack, Email, or WhatsApp.
- Demo Booking CTA: Implement a 'Book a Demo' call-to-action (CTA) to convert Sponsorship Dashboard visitors into demo bookings and unlock full profiles, pricing, and proposal design by KIBI's Sponsorship team.
- Admin Interface: Provide an admin interface to manage leads, update statuses, assign owners, and export briefs.

## Style Guidelines:

- Primary color: Vibrant orange (#FF8C00), conveying energy, enthusiasm, and a sense of forward movement, reflecting the dynamism of sports and brand partnerships.
- Background color: Light beige (#F5F5DC) provides a neutral and clean backdrop that emphasizes the content and avoids distracting the user.
- Accent color: Deep blue (#191970), which lends sophistication and trust, perfect for calls to action and highlighting key information.
- Body and headline font: 'Inter', a sans-serif font known for its readability and modern appearance, is ideal for the main content of the dashboard, to maintain an objective and tech-forward aesthetic.
- Code font: 'Source Code Pro', for clear display of configuration snippets and data structures.
- Use clean and recognizable icons representing various sports, industries, and objectives to enhance user understanding and navigation.
- Subtle transitions and loading animations to enhance user experience, provide feedback, and keep users engaged while the system processes their requests.
export default function About() {
  return (
    <div className="min-h-screen grain py-12 md:py-16">
      <div className="container px-4 md:px-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">Our Story</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            How a 4am obsession became Sandyford's neighbourhood bakery
          </p>
        </div>

        {/* Hero Image */}
        <div className="mb-16 rounded-2xl overflow-hidden shadow-xl">
          <img
            src="/bakery-interior.jpg"
            alt="Inside Nero Bakery"
            className="w-full aspect-[16/9] object-cover"
          />
        </div>

        {/* Story Content */}
        <div className="prose prose-lg max-w-none space-y-8 text-foreground">
          <div className="space-y-4">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
              It Started with Sourdough
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              In 2018, Marcus Nero was working as a software engineer, but every weekend he'd disappear 
              into his kitchen at 4am to tend to his starter. Friends would drop by for coffee and 
              leave with a loaf. Coworkers started placing orders. Within six months, he was baking 
              60 loaves a week out of a shared commercial kitchen in Sandyford.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              By 2019, the decision was made: quit the job, find a space, open the doors. Nero Bakery 
              started as a Thursday-through-Sunday operation in a 600-square-foot storefront on Sandyford Road. 
              Just Marcus, a deck oven, and a conviction that bread should take as long as it needs to take.
            </p>
          </div>

          <div className="my-12 p-8 bg-muted/50 rounded-2xl border border-border">
            <img
              src="/hands-baking.jpg"
              alt="Hands shaping dough"
              className="w-full aspect-[3/2] object-cover rounded-xl mb-6"
            />
            <blockquote className="text-lg font-medium text-center italic text-foreground">
              "If you're not willing to wait three days for the dough, you won't taste what time does to flour."
            </blockquote>
            <p className="text-center text-muted-foreground mt-2">— Marcus Nero, Founder</p>
          </div>

          <div className="space-y-4">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
              More Than Bread
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Within a year, the menu expanded. Marcus brought on pastry chef Lena Park, who'd spent 
              five years at a Michelin-starred restaurant but wanted to make croissants people could 
              afford to eat three times a week. She learned lamination from YouTube and refined it 
              through a thousand failed batches.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Now the menu includes laminated pastries (croissants, pain au chocolat, almond danishes), 
              seasonal pies, custom celebration cakes, and a modest coffee program. The space grew too— 
              in 2021 we moved two blocks over into a corner spot with floor-to-ceiling windows. 
              You can watch the bread come out of the oven from the sidewalk.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 my-12">
            <div className="p-6 bg-card border border-border rounded-xl">
              <h3 className="font-display text-xl font-bold mb-3 text-foreground">Our Process</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Sourdough starter maintained since 2017</li>
                <li>• 72-hour cold fermentation</li>
                <li>• Organic flour milled in Ireland</li>
                <li>• Hand-shaped, never mechanical</li>
                <li>• Baked in a deck oven built in 1983</li>
              </ul>
            </div>
            <div className="p-6 bg-card border border-border rounded-xl">
              <h3 className="font-display text-xl font-bold mb-3 text-foreground">Our Values</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Time over speed</li>
                <li>• Local ingredients when possible</li>
                <li>• Living wages for everyone</li>
                <li>• No shortcuts, no preservatives</li>
                <li>• Closed Mondays and Tuesdays (rest matters)</li>
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
              Fáilte — Visit Us
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We're located in Sandyford Business Park, just off the Luas Green Line. 
              The morning light hits the windows just right around 8am. Come early if you 
              want the almond croissants — they sell out by 10.
            </p>
          </div>

          <div className="p-8 bg-primary/10 border border-primary/20 rounded-2xl space-y-4">
            <h3 className="font-display text-2xl font-bold text-foreground">Hours & Location</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2 text-foreground">Hours</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>Wednesday – Friday: 7am – 5pm</li>
                  <li>Saturday – Sunday: 8am – 4pm</li>
                  <li>Monday – Tuesday: Closed</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-foreground">Find Us</h4>
                <p className="text-muted-foreground">
                  14 Sandyford Business Park<br />
                  Sandyford, Dublin 18, D18 X5K2<br />
                  <a href="tel:+35315550199" className="text-primary hover:underline">
                    +353 1 555 0199
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

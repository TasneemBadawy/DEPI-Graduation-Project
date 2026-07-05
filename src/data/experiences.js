import thingBalloon from "../assets/thing-balloon.jpg";
import thingDiving from "../assets/thing-diving.jpg";
import thingCamel from "../assets/thing-camel.jpg";
import thingFood from "../assets/thing-food.jpg";
import thingBazaar from "../assets/thing-bazaar.jpg";
import tourNile from "../assets/tour-nile.jpg";

export const EXPERIENCES = [
  { slug: "hot-air-balloon-cappadocia", title: "Sunrise hot-air balloon over Cappadocia", city: "Cappadocia", image: thingBalloon, tag: "Iconic", price: 180 },
  { slug: "dive-great-barrier-reef", title: "Dive the Great Barrier Reef", city: "Queensland", image: thingDiving, tag: "Underwater", price: 140 },
  { slug: "camel-ride-sahara", title: "Camel ride across the Sahara", city: "Merzouga", image: thingCamel, tag: "Desert", price: 35 },
  { slug: "street-food-crawl-bangkok", title: "Street food crawl in Bangkok", city: "Bangkok", image: thingFood, tag: "Food", price: 25 },
  { slug: "night-markets-marrakech", title: "Night markets of Marrakech", city: "Marrakech", image: thingBazaar, tag: "Markets", price: 20 },
  { slug: "sail-greek-islands", title: "Sail the Greek islands", city: "Cyclades", image: tourNile, tag: "On water", price: 95 },
];

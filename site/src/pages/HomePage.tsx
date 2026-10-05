import { ContactPanel } from "../components/ContactPanel";
import { Layout } from "../layout/Layout";
import { Hero } from "./home/Hero";
import { PlanYourMove } from "./home/PlanYourMove";
import { RouteCards } from "./home/RouteCards";

export const HomePage = () => (
  <Layout title="Global Talent UK" path="/">
    <Hero />
    <RouteCards />
    <PlanYourMove />
    <div class="gt-container gt-closing gt-closing--home">
      <ContactPanel />
    </div>
  </Layout>
);

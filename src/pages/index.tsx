import { NavigateToResource } from "@refinedev/nextjs-router";

const Home = () => {
  return <NavigateToResource resource="products" />;
};

export default Home;

Home.noLayout = true;

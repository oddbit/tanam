import { GetServerSideProps } from "next";
import { getSiteData } from '../queries/site';
import { TanamSite } from '../models/tanamSite';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { site } = context.params as { site: string };
  const siteData: TanamSite | null = await getSiteData(site);
  console.log(JSON.stringify(siteData, null, 2));

  if (!siteData) {
    return {
      notFound: true,
    };
  }
  
  return {
    props: {
      siteData: siteData.toJson(),
    },
  };
};

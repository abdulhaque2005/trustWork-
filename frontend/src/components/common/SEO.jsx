import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords }) => {
  const siteName = "EscrowFlow";
  const fullTitle = title ? `${title} | ${siteName}` : `${siteName} — Secure Freelance Escrow Platform`;
  const metaDescription = description || "EscrowFlow is a secure freelance escrow platform. Manage projects, payments, and disputes with trust and transparency.";
  const metaKeywords = keywords || "escrow, freelance, payments, projects, secure, saas, dispute resolution";

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={metaKeywords} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={siteName} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
    </Helmet>
  );
};

export default SEO;

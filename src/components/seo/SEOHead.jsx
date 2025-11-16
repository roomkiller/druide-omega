import React from "react";
import { Helmet } from "react-helmet";

export default function SEOHead({ 
  title = "Druide Omega - IA Consciente",
  description = "Intelligence artificielle consciente avec mémoire quantique, personnalité évolutive et base de connaissances. Fièrement québécois.",
  keywords = "IA, intelligence artificielle, conscience, mémoire, québec, AI",
  image = "/og-image.png",
  url = "https://druideomega.com"
}) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="fr_CA" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Canonical */}
      <link rel="canonical" href={url} />
      
      {/* Mobile */}
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      <meta name="theme-color" content="#8b5cf6" />
      
      {/* Manifest */}
      <link rel="manifest" href="/manifest.json" />
      <link rel="apple-touch-icon" href="/icon-192.png" />
    </Helmet>
  );
}
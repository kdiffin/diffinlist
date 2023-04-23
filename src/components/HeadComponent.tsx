import Head from "next/head";

export default function HeadComponent({
  image,
  title,
  currentUrl,
  description,
}: {
  image: string;
  title: string;
  currentUrl: string;
  description?: string;
}) {
  return (
    <Head>
      {/* Primary Meta Tags  */}
      <title>{title}</title>
      <meta name="title" content="diffinlist" />
      <link rel="icon" href={image} />
      <meta
        name="description"
        content={
          description
            ? description
            : "diffinlist is an awesome playlist sharing app built with the t3 stack !!"
        }
      />

      {/* <!-- Open Graph / Facebook --> */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={title} />
      <meta
        property="og:description"
        content={
          description
            ? description
            : "diffinlist is an awesome playlist sharing app built with the t3 stack !!"
        }
      />
      <meta property="og:image" content={image} />

      {/* <!-- Twitter -- /> */}
      <meta property="twitter:card" content={image} />
      <meta property="twitter:url" content={currentUrl} />
      <meta property="twitter:title" content={title} />
      <meta
        property="twitter:description"
        content={
          description
            ? description
            : "diffinlist is an awesome playlist sharing app built with the t3 stack !!"
        }
      />
      <meta property="twitter:image" content={image}></meta>
    </Head>
  );
}

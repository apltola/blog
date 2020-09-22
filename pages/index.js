import Head from 'next/head';
import Layout, { siteTitle } from '../components/layout';
import utilStyles from '../styles/utils.module.css';
import { getSortedPostsData } from '../lib/posts';
import useSWR from 'swr';
import fetch from 'unfetch';
import axios from 'axios';
import Link from 'next/link';
import Date from '../components/date';

/* const fetcher = async (url) => {
  const res = await fetch(url);
  return res.json();
}; */

const fetcher = async (url) => {
  const res = await axios.get(url);
  return res.data;
};

export default function Home({ allPostsData }) {
  const { data, error } = useSWR('/api/hello', fetcher);

  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;

  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>{data.name}</p>
      </section>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Blog</h2>
        <ul className={utilStyles.list}>
          {allPostsData.map(({ id, date, title }) => (
            <li className={utilStyles.listItem} key={id}>
              <Link href={`/posts/${id}`}>
                <a>{title}</a>
              </Link>
              <br />
              <small className={utilStyles.lightText}>
                <Date dateString={date} />
              </small>
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  );
}

export async function getStaticProps() {
  const allPostsData = getSortedPostsData();
  console.log('static_props --> ', allPostsData);
  return {
    props: {
      allPostsData,
    },
  };
}

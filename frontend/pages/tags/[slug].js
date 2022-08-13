import { useRef, useEffect } from 'react';
import Error from 'next/error';
import Head from 'next/head';
import Layout from '@/components/Layout';
import TagActions from '@/actions/tag';
import BlogActions from '@/actions/blog';
import BlogListCard from '@/components/Blog/ListCard';
import { withRouter } from 'next/router';
import { DOMAIN, APP_NAME, FB_APP_ID } from '@/config';

const TagIndex = ({ query , tag, blogs, router }) => {
  if(!tag) {
    return <Error statusCode={404}/>
  }

  console.log('blogs: ', blogs)

  const refBlogListCard = useRef();
  const isMounted = useRef(true);

  useEffect(() => {
    if(isMounted.current) {
      isMounted.current = false;
    } else if (tag) {
      refBlogListCard.current.reset({
        pageSize: blogs.pageSize, 
        page: blogs.page,
        filters: {
          tags: tag._id
        }
      });
    }
  }, [query.slug])

  const renderHeadSEO = () => (
    <Head>
      <title> {tag.name} | {APP_NAME}</title>
      <meta name="description" content={`${tag.name} | ${APP_NAME}`} />
      <link ref="canonical" href={`${DOMAIN}${router.pathname}`} />

      <meta property="og:title" content={tag.name} />
      <meta property="og:description" content={`Research ${tag.name}`} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`${DOMAIN}${router.pathname}`} />
      <meta property="og:site_name" content={APP_NAME} />

      <meta property="og:image" content={`${DOMAIN}/images/seoblog.jpg`} />
      <meta property="og:image:secure_url" content={`${DOMAIN}/images/seoblog.jpg`} />
      <meta property="og:image:type" content="image/jpg" />
      <meta property="fb:app_id" content={FB_APP_ID} />
    </Head>
  );

  return (
    <>
      {renderHeadSEO()}
      <Layout>
        <main>
          <header className="container-fluid mb-4">
            <div>
              <h1 className="mt-4 text-center font-weight-bold">
                {tag.name}
              </h1>
            </div>
          </header>
          <div className="container">
            <BlogListCard ref={refBlogListCard} initialBlogs={blogs}/>
          </div>
        </main>
      </Layout>
    </>
  )
}

TagIndex.getInitialProps = async ({ query }) => {
  let tag = await TagActions.detail(query.slug);
  let blogs, pageSize = 10, page = 0;
  if(tag.data) {
    blogs = await BlogActions.getAll({
      pageSize, page,
      filters: {
        tags: tag.data._id
      }
    });
  }
  return { 
    query,
    tag: tag.data, 
    blogs: (blogs && blogs.data)  ? blogs.data : { data: [], pageSize, page, total: 0 },
  }
}

export default withRouter(TagIndex);

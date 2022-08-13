import Head from 'next/head';
import Layout from '@/components/Layout';
import BlogActions from '@/actions/blog';
import TagActions from '@/actions/tag';
import CategoryActions from '@/actions/category';
import { get as getData } from 'lodash';
import { withRouter } from 'next/router';
import { DOMAIN, APP_NAME, FB_APP_ID } from '@/config'
import BlogListCard from '@/components/Blog/ListCard';
import ButtonLinkBySlug from '@/components/Buttons/LinksBySlug';

const Blogs = ({ blogs, tags, categories, router }) => {
  const renderHeadSEO = () => (
    <Head>
      <title>Programing blogs | {APP_NAME}</title>
      <meta name="description" content="Programing blogs | nghiadt Blog" />
      <link rel="canonical" href={`${DOMAIN}${router.pathname}`} />

      <meta property="og:title" content={`Latest web development | ${APP_NAME}`} />
      <meta property="og:description" content="Programing blogs | nghiadt Blog" />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`${DOMAIN}${router.pathname}`} />
      <meta property="og:site_name" content={APP_NAME} />

      <meta property="og:image" content={`${DOMAIN}/images/seoblog.jpg`} />
      <meta property="og:image:secure_url" content={`${DOMAIN}/images/selblog.jpg`} />
      <meta property="og:image:type" content="image/jpg" />
      <meta property="fb:app_id" content={FB_APP_ID} />
    </Head>
  )

  return (
    <>
      {renderHeadSEO()}
      <Layout>
        <main>
          <header className="container-fluid">
            <div>
              <h1 className="mt-4 text-center font-weight-bold">
                This is list blog
              </h1>
              <section className="mt-4">
                <div className="text-center">
                  <ButtonLinkBySlug 
                    data={getData(categories, 'data', [])}
                    classNameExtend='btn-primary'
                    prefixPathname='/categories'
                  />
                </div>
                <div className="text-center">
                  <ButtonLinkBySlug 
                    data={getData(tags, 'data', [])}
                    classNameExtend="btn-outline-primary"
                    prefixPathname="/tags"
                  />
                </div>
              </section>
            </div>
          </header>
          <div className="container">
            <BlogListCard initialBlogs={blogs} />
          </div>
        </main>
      </Layout>
    </>
  )
}

Blogs.getInitialProps = async () => {
  let pageSize = 10;
  let page = 0;
  let blogs = await BlogActions.getAll({ pageSize, page });
  let tags = await TagActions.getAll();
  let categories = await CategoryActions.getAll();
  return {
    blogs: (blogs && blogs.data) ? blogs.data : { data: [], pageSize, page },
    tags: (tags && tags.data) ? tags.data : { data: [] },
    categories: (categories && categories.data) ? categories.data : { data: [] },
  }
}

export default withRouter(Blogs);

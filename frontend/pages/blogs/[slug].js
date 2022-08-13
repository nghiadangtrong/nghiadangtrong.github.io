import { useState, useEffect } from 'react';
import Error from 'next/error'
import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/Layout';
import BlogActions from '@/actions/blog';
import { makeApiUrl } from '@/helper/utils';
import moment from 'moment';
import { get as getData } from 'lodash';
import { DOMAIN, APP_NAME, FB_APP_ID } from '@/config';
import ButtonsLinkBySlug from '@/components/Buttons/LinksBySlug'

const BlogDetail = ({ query, blog }) => {
  let [blogsRelated, setBlogsRelated] = useState([]);

  const fetchBlogRelated = async () => {
    if (!query.slug || !blog) {
      return;
    }
    let response = await BlogActions.getRelated(query.slug);
    if (response.error) {
      return;
    }
    setBlogsRelated(response.data || [])
  }

  useEffect(() => {
    fetchBlogRelated()
  }, [query.slug])

  const renderBlogsReated = () => (
    <div className="row">
      { blogsRelated.map(blogRelated => {
        let urlBlog = `${DOMAIN}/blogs/${blogRelated.slug}`;
        return (
          <article key={blogRelated._id} className='col-12 col-sm-12 col-md-4 col-lg-4'>
            <div className="card">
              <Link href={urlBlog}>
                <img
                  className="card-img-top cursor-pointer"
                  style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                  src={makeApiUrl(['api', 'blogs', 'photo', blogRelated.slug])}
                  alt={blogRelated.slug}
                />
              </Link>

              <div className="card-body">
                <Link href={urlBlog}>
                  <h5 className="card-title cursor-pointer">{blogRelated.title}</h5>
                </Link>
                <p className="card-text">{blogRelated.excerpt}</p> 
              </div>

              <div className="card-body">
                Posted {moment(blogRelated.createdAt).fromNow()} 
                <div className="float-end btn btn-link">{blogRelated.postBy.name}</div>
              </div>
            </div>
          </article>
        )
      }) }
    </div>
  )

  const renderHeadSEO = () => (
    <Head>
      <title>{blog.title} | {APP_NAME} </title>
      <meta name="description" content={blog.metaDescription} />

      <meta property="og:title" content={`${blog.title} | ${APP_NAME}`} />
      <meta property="og:description" content={blog.metaDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`${DOMAIN}/blogs/${query.slug}`} />
      <meta property="og:site_name" content={APP_NAME} />

      <meta property="og:image" content={makeApiUrl(['api', 'blogs', 'photo', blog.slug])} />
      <meta property="og:image:secure_url" content={makeApiUrl(['api', 'blogs', 'photo', blog.slug])} />
      <meta property="og:image:type" content="image/jpg" />
      <meta property="fb:app_id" content={FB_APP_ID} />
    </Head>
  )

  const renderButtons = (data = [], classNameExtend = '') => data.map(item =>
    <button key={item._id} className={`btn me-2 mb-2 ${classNameExtend}`}>
      {getData(item, 'name')}
    </button>
  )

  if (!blog) {
    return <Error statusCode={404} />
  }

  return (
    <>
      {renderHeadSEO()}
      <Layout>
        <section>
          <header>
            <img
              className="img img-fluid"
              style={{ width: '100%', maxHeight: '500px', objectFit: 'cover' }}
              src={makeApiUrl(['api', 'blogs', 'photo', blog.slug])} />
          </header>
        </section>
        <section>
          <div className="text-center mt-4">
            <h1>{blog.title}</h1>
            <p>
              Post by <b>{blog.postBy.name}</b> | publiced <b>{moment(blog.createdAt).fromNow()}</b>
            </p>
          </div>
        </section>
        <section>
          <div className="text-center mt-2 mb-5">
            <ButtonsLinkBySlug 
              data={blog.categories}
              classNameExtend={'btn-primary'}
              prefixPathname={'/categories'}
              />
            <ButtonsLinkBySlug
              data={blog.tags}
              classNameExtend='btn-outline-primary'
              prefixPathname='/tags'
            />
          </div>
        </section>

        <section>
          <div
            className="container"
            dangerouslySetInnerHTML={{ __html: blog.body }}
          ></div>
        </section>

        <section>
          <div className="container mt-5">
            <h2 className="text-center pt-5">Related Blog</h2>
            <hr />
            <div> {renderBlogsReated()} </div>
          </div>
        </section>

        <section>
          <div className="container mt-5">
            <div>Show comment</div>
          </div>
        </section>
      </Layout>
    </>
  )
}

BlogDetail.getInitialProps = async ({ query }) => {
  let blog = await BlogActions.get(query.slug);
  return { query, blog: blog ? blog.data : null }
}

export default BlogDetail;

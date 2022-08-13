import { useState, forwardRef, useImperativeHandle } from 'react';
import Link from 'next/link';
import BlogActions from '@/actions/blog';
import { makeApiUrl } from '@/helper/utils';
import { get as getData } from 'lodash';
import moment from 'moment';
import ButtonLinksBySlug from '@/components/Buttons/LinksBySlug';

const ListCard = ({ initialBlogs = { pageSize: 10, page: 0, total: 0 } }, forwardedRef) => {
  let [blogs, setBlogs] = useState(initialBlogs);
  let [loading, setLoading] = useState(false);

  const renderBlogs = (data = []) => {
    if(!Array.isArray(data)) {
      return 
    }
    return data.map((blog, index) => {
      let UrlDetail = `/blogs/${blog.slug}`;
      let isElementEnd = data.length - 1 > index;

      return (
        <article key={blog._id} className={`mb-2 pb-3 ${isElementEnd ? 'border-bottom-grey' : ''}`}>
          <div className="lead mt-2">
            <header>
              <Link href={UrlDetail}>
                <h3>{blog.title}</h3>
              </Link>
            </header>
          </div>
          <section>
            <p> Post by <b>{blog.postBy.name}</b> | publiced <b>{moment(blog.createdAt).fromNow()}</b> </p>
          </section>

          <section>
            <div>
              <ButtonLinksBySlug
                data={blog.categories}
                classNameExtend='btn-primary'
                prefixPathname='/categories'
              />
              <ButtonLinksBySlug
                data={blog.tags}
                classNameExtend='btn-outline-primary'
                prefixPathname='/tags'
              />
            </div>
          </section>

          <div className='row'>
            <div className="col-12 col-sm-12 col-md-4 col-lg-4 text-center">
              <Link href={UrlDetail}>
                <img
                  className="img-thumbnail cursor-pointer"
                  style={{ maxHeight: '200px', width: '100%', objectFit: 'cover' }}
                  src={makeApiUrl(['api', 'blogs', 'photo', blog.slug])}
                  alt={blog.slug}
                />
              </Link>
            </div>
            <div className="col-12 col-sm-12 col-md-8 col-lg-8">
              {blog.excerpt}
              {" "}
              <Link href={UrlDetail}>Readme</Link>
            </div>
          </div>
        </article>
      )
    })
  }

  const reset = async (options) => {
    setLoading(true);
    let newBlogs = await BlogActions.getAll(options);
    setLoading(false);
    if (newBlogs.error || !newBlogs.data) {
      window.alert(newBlogs.error);
      return;
    }
    setBlogs(blogs => ({ ...blogs, ...newBlogs.data }))
  }

  const loadMore = async () => {
    let { pageSize, page } = blogs;
    setLoading(true);
    let newBlog = await BlogActions.getAll({ pageSize, page: page + 1 });
    setLoading(false);
    if (newBlog.error) {
      window.alert(newBlog.error)
      return
    }
    setBlogs((blog) => ({
      ...blog,
      data: [...blog.data, ...newBlog.data.data],
      page: newBlog.data.page
    }));

  }
  const renderLoadMore = () => {
    let numberBlogOfLoaded = blogs.data.length;
    let blogTotal = blogs.total;
    let notFullLoaded = numberBlogOfLoaded < blogTotal;
    return (notFullLoaded &&
      <div className="text-center pt-4 pb-4">
        <button
          className="btn btn-primary"
          disabled={loading}
          onClick={loadMore}
        >
          Load More
        </button>
      </div>
    )
  }

  useImperativeHandle(forwardedRef, () => ({ reset }))

  return (
    <section>
      <div>
        {renderBlogs(getData(blogs, 'data', []))}
      </div>
      <div className="text-center">{renderLoadMore()}</div>
    </section>
  )
}

export default forwardRef(ListCard);

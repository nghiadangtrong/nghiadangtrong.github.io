import Error from 'next/error';
import AdminLayout from '../../../components/Layout/Admin';
import BlogEditFrom from '../../../components/Blog/CreateForm';
import BlogActions from '../../../actions/blog';

const BlogEditPage = ({ query, blog }) => {
  if(!blog) {
    return <Error statusCode={404} />
  }
  return (
    <AdminLayout>
      <div className="container">
        <BlogEditFrom isEdit={true} initialValue={blog} />
      </div>
    </AdminLayout>
  )
}

BlogEditPage.getInitialProps = async ({ query }) => {
  let blog = await BlogActions.get(query.slug)
  return { query , blog: blog.data }
}


export default BlogEditPage;

import AdminLayout from '../../../components/Layout/Admin';
import BlogCreateForm from '../../../components/Blog/CreateForm';

const BlogCreatePage = () => {
  return (
    <AdminLayout>
      <div className='container'>
        <div className="col-12 col-sm-12 col-md-12 col-lg-12">
          <BlogCreateForm />
        </div>
      </div>
    </AdminLayout>
  )
}

export default BlogCreatePage;

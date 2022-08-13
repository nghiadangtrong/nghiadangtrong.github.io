import Link from 'next/link';

const Dashboard = () => {

  return (
    <div className="container-fluid">
      <h3 className="mb-5">Dashboard</h3>
      <div className='row'>
        <div className='col-xs-12 col-sm-12 col-md-6 col-lg-3'>
          <div className="list-group">
            <li className="list-group-item">
              <Link href="/admin/basic/categories-tags">Add Category - Tag</Link>
            </li>
            <li className="list-group-item">
              <Link href="/admin/blog/create">Add Blog</Link>
            </li>
            <li className="list-group-item">
              <Link href="/admin/blog/list" >Update/Delete Blog</Link>
            </li>
          </div>
        </div>
        <div className='col-xs-12 col-sm-12 col-md-6 col-lg-3'></div>
      </div >
    </div>
  )
}

export default Dashboard;

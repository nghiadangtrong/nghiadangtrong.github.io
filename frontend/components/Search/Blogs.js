import { useState, useRef } from 'react';
import BlogActions from '@/actions/blog';
import { useRouter } from 'next/router';

const SearchBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const refInput = useRef()
  const router = useRouter();

  const onSearch = async (e) => {
    e.preventDefault();
    let search = refInput.current.value;
    if (!search) {
      return window.alert("Please enter value!");
    }
    let response = await BlogActions.getAll({
      pageSize: -1,
      filters: {
        $or: [
          {
            title: { $regex: search, $options: 'i' }
          },
          {
            body: { $regex: search, $options: 'i' }
          }
        ]
      }
    })

    if (response.error) {
      return;
    }
    setBlogs(response.data.data)
  }

  const changeSearch = () => {
    if (blogs.length) {
      setBlogs([])
    }
  }

  const renderFormSearch = () => (
    <form onSubmit={onSearch}>
      <div className="row">
        <div className="col-12 col-sm-12">
          <div className="input-group mb-3">
            <input ref={refInput} onChange={changeSearch} type="search" className='form-control' placeholder="Search" />
            <button type="submit" className="btn btn-outline-secondary">Search</button>
          </div>
        </div>
      </div>
    </form>
  )

  const renderResult = () => {
    return blogs.map(blog => (
      <div className="btn btn-link"
        onClick={() => {
          refInput.current.value = null
          setBlogs([]);
          router.push(`/blogs/${blog.slug}`)
        }}
        style={{ width: '100%', background: '#f1f1f1' }}
      >
        {blog.title}
      </div>
    ))
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-12 col-sm-12 col-md-12 col-xs-12">
          {renderFormSearch()}
        </div>
        <div className="col-12 col-sm-12 col-md-12 col-xs-12">
          {renderResult()}
        </div>
      </div>
    </div>
  )
}

export default SearchBlogs;

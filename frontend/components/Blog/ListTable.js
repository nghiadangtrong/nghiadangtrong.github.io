import { useState, useEffect } from 'react';
import Link from 'next/link';
import BlogActions from '@/actions/blog';
import { get as getData } from 'lodash';
import { DOMAIN } from '@/config';

const List = () => {
  let [data, setData] = useState({
    data: [],
    page: 0,
    pageSize: 10,
    total: 0
  });

  const deleteBlog = async (slug) => {
    if (window.confirm('You want delete?')) {
      let response = await BlogActions.remove(slug);
      if (response.error) {
        console.log(response.error)
        return window.alert(response.error)
      }
      fetch();
    }
  }

  let columns = [
    {
      title: 'STT',
      render: (row, indexRow, indexData) => (
        <div>{indexData}</div>
      )
    },
    {
      title: 'Title',
      field: 'title'
    },
    {
      title: "Create By",
      field: 'postBy.name'
    },
    {
      title: 'Actions',
      render: (row) => {
        return (
          <div>
            <Link href={`${DOMAIN}/admin/blog/${row.slug}`}>
              <button className="btn btn-outline-primary">Edit</button>
            </Link>
            <button className="btn btn-outline-danger" onClick={() => deleteBlog(row.slug)}>Delete</button>
          </div>
        )
      }
    }
  ]

  const fetch = async (options = { pageSize: data.pageSize, page: data.page }) => {
    let response = await BlogActions.getAll(options);
    if (response.error) {
      return window.alert(response.error)
    }
    setData((data) => ({
      ...data,
      ...response.data
    }))
  }

  useEffect(() => {
    fetch({
      pageSize: data.pageSize,
      page: data.page,
    });
  }, [])

  const renderTableHead = () => (
    <thead>
      <tr>
        {columns.map((col, index) => (
          <th key={index}>{col.title}</th>
        ))}
      </tr>
    </thead>
  )

  const renderTableBody = () => (
    <tbody>
      {data.data.map((row, indexRow) => {
        return (
          <tr key={indexRow}>
            {columns.map((col, indexCol) => {
              let indexData = (data.pageSize * data.page) + indexRow + 1;
              let dataColumn = col.render
                ? col.render(row, indexRow, indexData)
                : getData(row, col.field, '');
              return (
                <td key={indexCol}>{dataColumn}</td>
              )
            })}
          </tr>
        )
      })}
    </tbody>
  )

  const renderNavigation = () => {
    let pageSize = data.pageSize;
    let total = data.total;
    let pages = Math.ceil(total / pageSize);
    let page = data.page + 1;

    let pageItem = [];
    let pageList = [];
    if (pages < 8) {
      for (let i = 1; i <= pages; i++) {
        pageList.push(i)
      }
    } else {
      if (page <= 3) {
        pageList = [1, 2, 3, 4, null, pages];
      } else if (page == 4) {
        pageList = [1, 2, 3, 4, 5, null, pages];
      } else if (page == pages - 3) {
        pageList = [1, null, pages - 4, pages - 3, pages - 2, pages - 1, pages]
      } else if (page >= pages - 2) {
        pageList = [1, null, pages - 3, pages - 2, pages - 1, pages]
      } else {
        pageList = [1, null, page - 1, page, page + 1, null, pages]
      }
    }
    pageItem = pageList.map((_page, i) => {
      return _page
        ? <li key={i} className={`page-item cursor-pointer unselected ${page === _page ? 'active' : ''}`}>
          <a className="page-link" onClick={() => fetch({ pageSize, page: _page - 1 })}>{_page}</a>
        </li>
        : <li key={i} className={`page-item unselected`}>
          <a className="page-link">...</a>
        </li>
    })

    return (
      <nav ariaLabel='Page navigation example'>
        <ul className="pagination justify-content-center">
          <li className={`page-item cursor-pointer unselected ${page <= 1 ? 'disabled' : ''}`}>
            <a
              className="page-link disabled"
              onClick={() => {
                if (page > 1) {
                  fetch({ pageSize, page: page - 2 })
                }
              }}
            >Preious</a>
          </li>
          {pageItem}
          <li className={`page-item cursor-pointer unselected ${page >= pages ? 'disabled' : ''}`}>
            <a className="page-link"
              onClick={() => {
                if (page < pages) {
                  fetch({ pageSize, page: page })
                }
              }}
            >Next</a>
          </li>
        </ul>
      </nav>
    )
  }

  return (
    <>
      <div className="container">
        <h2 className="mt-4 mb-4 font-weight-bold">List blogs</h2>
        <table className="table table-bordered">
          {renderTableHead()}
          {renderTableBody()}
        </table>
        {renderNavigation()}
      </div>
    </>
  )
}

export default List;

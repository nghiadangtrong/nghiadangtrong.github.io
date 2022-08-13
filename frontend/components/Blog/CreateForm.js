import { useState, useEffect } from 'react';
import { withRouter } from 'next/router';
import dynamic from 'next/dynamic';
import CategoryActions from '@/actions/category';
import TagActions from '@/actions/tag';
import BlogActions from '@/actions/blog';
import { get as getData } from 'lodash';
import { makeApiUrl } from '@/helper/utils';

const ReactQuillNoSSR = dynamic(
  () => import('react-quill'),
  { ssr: false }
)
import 'react-quill/dist/quill.snow.css';

const ConfigReactQuill = {
  modules: {
    toolbar: [
      [{ header: '1' }, { header: '2' }, { header: [3, 4, 5, 6] }, { font: [] }],
      [{ size: [] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image', 'video'],
      ['clean'],
      ['code-block']
    ]
  },
  formats: [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'link',
    'image',
    'video',
    'code-block'
  ]
}

const convertObjectCheckbox = (data = []) => {
  return data.reduce((newData, oldData) => { return { ...newData, [oldData._id]: true } }, {})
}

const CreateForm = ({ router, isEdit, initialValue }) => {
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState({
    error: false,
    success: false,
    title: initialValue ? initialValue.title : '',
    categories: initialValue ? convertObjectCheckbox(initialValue.categories) : {},
    tags: initialValue ? convertObjectCheckbox(initialValue.tags) : {},
    photo: initialValue ? makeApiUrl(['api', 'blogs', 'photo', initialValue.slug]) : null,
  })
  const [body, setBody] = useState(initialValue ? initialValue.body : '')
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [insertHtml, setInsertHtml] = useState(false);

  const loadCategory = async () => {
    const response = await CategoryActions.getAll();
    if (!response.error) {
      setCategories(response.data.data);
    }
  }

  const loadTag = async () => {
    const response = await TagActions.getAll();
    if (!response.error) {
      setTags(response.data.data);
    }
  }

  useEffect(() => {
    loadCategory();
    loadTag();
  }, [])

  useEffect(() => {
    console.log('[+] router change')
  }, [router]);

  const getFormData = (values = {}) => {
    const formData = new FormData();

    Object.entries(values).map(([name, value]) => {
      if (Array.isArray(value)) {
        value.map(item => {
          formData.append(`${name}[]`, item)
        })
      } else {
        formData.append(name, value)
      }
    })

    return formData;
  }

  const convertDataCheckbox = (objectIds = {}) => {
    return Object.entries(objectIds).reduce((ids, objectId) => { return objectId[1] ? [...ids, objectId[0]] : ids }, [])
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    const formData = getFormData({
      title: value.title,
      body: body,
      photo: value.photo,
      categories: convertDataCheckbox(value.categories),
      tags: convertDataCheckbox(value.tags),
    });
    let response;
    if (isEdit) {
      response = await BlogActions.update(initialValue.slug, formData);
    } else {
      response = await BlogActions.create(formData);
    }
    setLoading(false);
    if (response.error) {
      return setValue({ ...value, error: response.error.error })
    }

    if (!isEdit) {
      setValue({
        error: false,
        title: '',
        categories: {},
        tags: {},
        photo: null,
      })
      setBody('')
    } else {
      let newSlug = response.data.slug;
      if (newSlug !== initialValue.slug) {
        router.replace(`/admin/blog/${newSlug}`)
      }
    }
  }

  const handleChange = (name, isFile = false) => e => {
    let currentValue = isFile ? e.target.files[0] : e.target.value;
    setValue({ ...value, [name]: currentValue, error: false, success: false })
  }

  const handleChangeCheckbox = (name, id) => e => {
    const objectIds = getData(value, `${name}`, {});
    objectIds[id] = !getData(objectIds, id);
    setValue({ ...value, [name]: objectIds, error: false, success: false })
  }

  const handleChangeBody = (body) => {
    setBody(body)
    setValue({ ...value, error: false, success: false })
  }

  const renderForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="title" className="fomr-label">Title</label>
        <input
          type="text"
          id="title"
          className="form-control"
          value={value.title}
          onChange={handleChange('title')}
        />
      </div>

      <div className="mb-3">
        <button onClick={() => setInsertHtml(state => !state)}>{insertHtml ? 'off-insert-html' : 'insert-html'}</button>
        {
          insertHtml ?
            <div>
              <textarea
                className="mt-2"
                style={{ width: '100%', height: '150px' }}
                value={body}
                onChange={(e) => { handleChangeBody(e.target.value) }}
              />
            </div>
            :
            <ReactQuillNoSSR
              className="mt-2"
              modules={ConfigReactQuill.modules}
              formats={ConfigReactQuill.formats}
              value={body}
              onChange={handleChangeBody}
              placeholder="Write something ..."
            />
        }
      </div>

      <div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {isEdit ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  )

  const renderPhoto = () => (
    <div className="mb-3">
      <h5>Featured image</h5>
      <hr />
      <small className="text-muted">Max size 1M</small>
      <br />
      <label className="btn btn-outline-info">
        Upload Featured image
        <input accept="image/*" type="file" onChange={handleChange('photo', true)} hidden />
        {value.photo ?
          <div style={{ width: 100, height: 100, margin: 'auto' }}>
            <img src={typeof value.photo === 'string' ? value.photo : URL.createObjectURL(value.photo)} style={{ objectFit: 'contain', width: '100%', height: '100%' }} />
          </div>
          : null}

      </label>
    </div>
  )

  const renderCheckboxList = ({ label, data = [], name }) => (
    <div className="mb-3">
      <h5>{label}</h5>
      <hr />
      <ul className="list-group">
        {data.map((item) => (
          <li key={item._id} className="list-unstyled">
            <label className="form-check-label">
              <input
                type="checkbox"
                checked={getData(value, `${name}.${item._id}`, false)}
                onChange={handleChangeCheckbox(name, item._id)}
                className="me-2"
              />
              {item.name}
            </label>
          </li>
        ))}
      </ul>
    </div>
  )

  const renderCategories = () => renderCheckboxList({
    label: 'Categories',
    data: categories,
    name: 'categories'
  })

  const renderTags = () => renderCheckboxList({
    label: 'Tags',
    data: tags,
    name: 'tags'
  });

  const renderNotify = () => (
    value.error
      ? <div className="alert alert-danger" role="alert">{value.error}</div>
      : value.success
        ? <div className="alert alert-success">{"Thành công!"}</div>
        : null
  )

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <h2>Create Blog</h2>
        </div>
        <div className="col-12">{renderNotify()}</div>
        <div className="col-12 col-sm-12 col-md-8 col-lg-8">
          {renderForm()}
        </div>
        <div className="col-12 col-sm-12 col-md-4 col-lg-4">
          {renderPhoto()}
          {renderCategories()}
          {renderTags()}
        </div>
      </div>
    </div>
  )
}


export default withRouter(CreateForm);

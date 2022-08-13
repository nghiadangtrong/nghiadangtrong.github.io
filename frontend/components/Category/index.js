import { useState, useEffect } from 'react'
import { Button } from 'reactstrap';
import CategoryAction from '@/actions/category';

const Category = () => {
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({name: ''});
    const [status, setStatus] = useState({ type: null, message: null })
    const [categories, setCategories] = useState([])

    const loadCategories = async () => {
        let response = await CategoryAction.getAll();
        if(!response.error) {
            setCategories(response.data.data);
        }
    }
    
    useEffect(() => {
        loadCategories();
    }, [])
    
    const changeInput = (e) => {
        setForm({ [e.target.name]: e.target.value })
    }

    const createCategory = async (e) => {
        e.preventDefault();
        if(form.name) {
            setLoading(true)

            let response = await CategoryAction.create({ name: form.name });
            if(response.error) {
                setStatus({ type: 'error', message: response.error.message });
            } else {
                loadCategories();
                setForm({name: ''})
                setStatus({ type: 'success', message: 'Add Categories Success'});
            }
            
            setLoading(false)
        }
    }

    const createForm = () => {
        return (
            <form onSubmit={createCategory}>
                <div className='mt-3 mb-3'>
                    <label htmlFor='name' className='form-label'>Category Name</label>
                    <input 
                        className='form-control' type='text' name='name' id='name' placeholder='Enter Name Category'
                        value={form.name}
                        onChange={changeInput}
                        disabled={loading}
                    />
                </div>
                <Button type='submit' color="primary" disabled={loading}>Create</Button>
            </form>
        ) 
    }

    const removeCategory = (category) => async e => {
        e.preventDefault();
        let agreeRemove = window.confirm(`You wan't remove category ${category.name}`);
        if(agreeRemove) {
            let response = await CategoryAction.remove(category.slug);
            if(response.error) {
                setStatus({ type: 'error', message: response.error.message });
            } else {
                loadCategories();
                setStatus({ type: 'success', message: `Remove ${category.name} success!`})
            }
        }
    }

    const listCategory = () => {
        return (
            <div className='mt-3'>
                {categories.map((category, index) => 
                    <Button 
                        key={index} 
                        className='mb-2'
                        style={{ marginRight: '5px'}}
                        outline 
                        color='success'
                        title='Double click to remove'
                        onDoubleClick={removeCategory(category)}
                    >
                        {category.name}
                    </Button>
                )}
            </div>
        )
    }

    const renderStatus = () => {
        switch(status.type) {
            case 'success': 
                return <div className='alert alert-success'>{status.message}</div>
            case 'error':
                return <div className='alert alert-danger'>{status.message}</div>
            default:
                return;
        }
    }

    const onRemoveStatus = () => {
        if(!status.type) return
        setStatus({ type: null, message: null })
    }

    return (
        <div> 
            {renderStatus()}
            <div onMouseMove={onRemoveStatus}>
                {createForm()}
                {listCategory()}
            </div>
        </div>
    )
}

export default Category;

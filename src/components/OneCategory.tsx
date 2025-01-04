import React, { Fragment } from 'react';
import { Link, useParams } from 'react-router-dom';

interface ThreadProps {
    id: number;
    title: string;
}

interface OneCategoryProps {
    threads: ThreadProps[];
    isLoaded: boolean;
    error: Error | null;
    categoryName: string;
}


const OneCategory: React.FC<OneCategoryProps> = () => {
    const { id = '' } = useParams();
    const [categoryThreads, setcategoryThreads] = React.useState<OneCategoryProps>({
        threads: [],
        isLoaded: false,
        error: null,
        categoryName: '',
    });

    React.useEffect(() => {
        let threadsData: ThreadProps[] = [];
        let categoryName = "";
      
        Promise.all([
          fetch("http://localhost:4000/v1/threads/" + id).then((r) => r.json()),
          fetch("http://localhost:4000/v1/categories/").then((r) => r.json()),
        ])
          .then(([jsonThreads, jsonCategories]) => {
            threadsData = jsonThreads.threads;
            const category = jsonCategories.categories.find(
              (c: { id: number }) => c.id === Number(id)
            );
            if (category) {
              categoryName = category.category_name;
            }
            setcategoryThreads({
              threads: threadsData,
              isLoaded: true,
              error: null,
              categoryName,
            });
          })
          .catch((error: any) => {
            setcategoryThreads({
              threads: [],
              isLoaded: true,
              error,
              categoryName: "",
            });
          });
      }, [id]);  

    let threads = categoryThreads.threads;
    const isLoaded = categoryThreads.isLoaded;
    const error = categoryThreads.error; 
    const categoryName = categoryThreads.categoryName;

    if(!threads) {
        threads = [];
    }

    if(error) {
        return <div>Error: {error.message}</div>;
    }

    else if(!isLoaded) {
        return <p>Loading...</p>;
    }

    else {
        return (
            <Fragment>
                <h2>Category: {categoryName} </h2>

                <div className="list-group">
                    {threads.map( (t) => (

                            <Link 
                              key={t.id}
                              to={`/threads/${t.id}`}
                              className="list-group-item list-group-item-action"
                            >
                              {t.title}
                            </Link>
                    ))}
                </div>
                
            </Fragment>
        );
    }
}

export default OneCategory;
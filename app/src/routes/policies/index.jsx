import { Suspense, lazy } from 'react';

import { MDXProvider } from '@mdx-js/react'
import { useParams } from "react-router-dom";

const Policies = () => {
    const { id } = useParams();
    const Policy = lazy(() => import(`./${id}.mdx`));

    return ( 
        <MDXProvider>
            <Suspense>
                <Policy />
            </Suspense>
        </MDXProvider>
    )
}

export default Policies;
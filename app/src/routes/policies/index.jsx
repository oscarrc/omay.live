import { Suspense, lazy } from 'react';

import { MDXProvider } from '@mdx-js/react'
import { useParams } from "react-router-dom";

const Policies = () => {
    const { id } = useParams();
    const Policy = lazy(() => import(`./${id}.mdx`));

    return ( 
        <MDXProvider>
            <Suspense>
                <section className="prose mx-auto max-w-full p-8 sm:rounded-lg bg-base-100">
                    <Policy />
                </section>
            </Suspense>
        </MDXProvider>
    )
}

export default Policies;
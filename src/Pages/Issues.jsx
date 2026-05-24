import React from 'react';
import { useLoaderData } from 'react-router';
import IssuesCard from '../Components/IssuesCard';
import Container from '../Components/Container';

const Issues = ( ) => {
    const data = useLoaderData();
        // console.log(data);
    return (
        <Container>
        <div>
            <div className="text-2xl text-center font-bold ">All Issues</div>
            <p className='text-center mb-10'>This page will display all issues.</p>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                {data.map((issue) => (
                    <IssuesCard key={issue._id} issue={issue} />

                ))}

              </div>  
        </div>
        </Container>
    );
};

export default Issues;
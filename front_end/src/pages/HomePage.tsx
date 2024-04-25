import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
//import FeedList from '@/components/feed/FeedList';
import { useGetProjectsQueries } from '../queries/projects.query';
//import { UserContext } from '@/contexts/UserContextProvider';

const HomePage = () => {
//  const { isLogin } = useContext(UserContext);
//  const [page, setPage] = useState(1);
//  const [isGlobal, setIsGlobal] = useState(true);
//  const [selectedTag, setSelectedTag] = useState('');
//  const [articlesInfo, tagsInfo] = useGetArticlesQueries(isGlobal, page, selectedTag);
    const { data } = useGetProjectsQueries();
    if (data === undefined)
      {
        return <p>error!</p>;
      }

    return (<ul>{data.map((x: any) => (<li>{x.title}</li>))}</ul>);
};

export default HomePage;

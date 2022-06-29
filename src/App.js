import React, { useEffect, useState } from 'react';
import './App.css';
import Tmdb from './Tmdb';
import MovieRow from './components/MovieRow';
import FeaturedMovie from './components/FeaturedMovie';
import Header from './components/Header';

export default () => {

    const [movieList, setMovieList] = useState([]);
    const [featuredData, setFeaturedData] = useState(null);
    const [blackHeader, setBlackHeader] = useState(false);

    useEffect(() => {
        const loadAll = async () => {
            // Pegando a lista TOTAL
            let list = await Tmdb.getHomeList();
            setMovieList(list);

            // Pegando o filme em destaque
            let originals = list.filter(i=>i.slug === 'originals');
            let randomChosen = Math.floor(Math.random() * (originals[0].items.results.length -1));
            let chosen = originals[0].items.results[randomChosen];
            let chosenInfo = await Tmdb.getMovieInfo(chosen.id, 'tv');
            setFeaturedData(chosenInfo);
        }

        loadAll();
    }, []);

    useEffect(()=>{
        const scrollListener = () => {
            if(window.scrollY > 10) {
                setBlackHeader(true);
            } else {
                setBlackHeader(false);
            }
        }

        window.addEventListener('scroll', scrollListener);

        return () => {
            window.removeEventListener('scroll', scrollListener);
        }
    }, []);

    return (
        <div className="page">

        <Header black={blackHeader} />

            {featuredData &&
                <FeaturedMovie item={featuredData} />
            }

            <section className="lists">
                {movieList.map((item, key)=>(
                   <MovieRow key={key} title={item.title} items={item.items}/>
                ))}
            </section>

            <footer>
                <strong>Feito para estudos pelo aluno <a className="mylinkedin" href="https://www.linkedin.com/in/joaogporteiro/" target="_blank" rel="noopener noreferrer">João Gabriel</a><br/>
                Todos os direitos de imagem para <a className="netflixrights" href="https://www.netflix.com/" target="_blank" rel="noopener noreferrer">Netflix®</a><br/>
                Dados fornecidos pelo site <a className="themoviedbsite" href="https://themoviedb.org/" target="_blank" rel="noopener noreferrer">themoviedb.org</a></strong>
            </footer>

            <div className="loader-container">
                <div className="loader"></div>
            </div>
        </div>
    )
}
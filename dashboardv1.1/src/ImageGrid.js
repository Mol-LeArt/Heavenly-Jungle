import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom'
import './ImageGrid.css'

const ImageGrid = ({ uris }) => {
  // ----- useState
  const [nfts, setNfts] = useState(null)

  // ----- useState


  const getNft = async () => {
    const nftArray = []

    for (var i = 0; i < uris.length; i++) {
      fetch(uris[i])
        .then((res) => res.json())
        .then((data) => {
          const nft = {
            title: data.title,
            description: data.description,
            image: data.image,
            createdAt: data.createdAt,
          }
          nftArray.push(nft)
          console.log(nft)
          nftArray.sort((a, b) => a.createdAt - b.createdAt)
          console.log(nftArray)
          setNfts([...nftArray])
        })
    }
  }

  useEffect(() => {
    getNft()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uris])

  return (
    <div className='img-grid'>
      {!nfts && <label>Wow, such empty!</label>}
      {nfts &&
        nfts.map((nft, index) => (
          <div className='img-wrap' key={index + 1}>
            <Link
              to={{
                pathname: `/community/${index + 1}`,
                state: {
                  tokenId: index + 1,
                  title: nft.title,
                  description: nft.description,
                  image: nft.image,
                },
              }}
            >
              <img class='h-full w-full object-cover' src={nft.image} alt='' />
            </Link>
          </div>
        ))}
    </div>
  )
}

export default ImageGrid;

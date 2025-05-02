import React from 'react';
import Gallery from './Gallery';

const galleryImages = [
  {
    id: 1,
    src: "/images/gallery/image1.jpg",
    alt: "Gallery Image 1",
    width: 800,
    height: 1200,
  },
  {
    id: 2,
    src: "/images/gallery/image2.jpg",
    alt: "Gallery Image 2",
    width: 1200,
    height: 800,
  },
  {
    id: 3,
    src: "/images/gallery/image3.jpg",
    alt: "Gallery Image 3",
    width: 800,
    height: 1000,
  },
  {
    id: 4,
    src: "/images/gallery/image4.jpg",
    alt: "Gallery Image 4",
    width: 1000,
    height: 1500,
  },
  {
    id: 5,
    src: "/images/gallery/image5.jpg",
    alt: "Gallery Image 5",
    width: 800,
    height: 1200,
  },
  {
    id: 6,
    src: "/images/gallery/image6.jpg",
    alt: "Gallery Image 6",
    width: 1200,
    height: 900,
  },
  {
    id: 7,
    src: "/images/gallery/image7.jpg",
    alt: "Gallery Image 7",
    width: 800,
    height: 1100,
  },
  {
    id: 8,
    src: "/images/gallery/image8.jpg",
    alt: "Gallery Image 8",
    width: 1000,
    height: 1300,
  },
  {
    id: 9,
    src: "/images/gallery/image9.jpg",
    alt: "Gallery Image 9",
    width: 800,
    height: 1200,
  },
  {
    id: 10,
    src: "/images/gallery/image10.jpg",
    alt: "Gallery Image 10",
    width: 1200,
    height: 800,
  },
  {
    id: 11,
    src: "/images/gallery/image11.jpg",
    alt: "Gallery Image 11",
    width: 800,
    height: 1000,
  },
  {
    id: 12,
    src: "/images/gallery/image12.jpg",
    alt: "Gallery Image 12",
    width: 1000,
    height: 1400,
  },
  {
    id: 13,
    src: "/images/gallery/image1.jpg",
    alt: "Gallery Image 13",
    width: 800,
    height: 1100,
  },
  {
    id: 14,
    src: "/images/gallery/image2.jpg",
    alt: "Gallery Image 14",
    width: 1200,
    height: 900,
  },
  {
    id: 15,
    src: "/images/gallery/image3.jpg",
    alt: "Gallery Image 15",
    width: 800,
    height: 1300,
  },
  {
    id: 16,
    src: "//images/gallery/image10.jpg",
    alt: "Gallery Image 16",
    width: 1000,
    height: 1200,
  },
  {
    id: 17,
    src: "/images/gallery/image5.jpg",
    alt: "Gallery Image 17",
    width: 800,
    height: 1000,
  },
  {
    id: 18,
    src: "/images/gallery/image6.jpg",
    alt: "Gallery Image 18",
    width: 1200,
    height: 1500,
  },
  {
    id: 19,
    src: "/images/gallery/image7.jpg",
    alt: "Gallery Image 19",
    width: 800,
    height: 1200,
  },
  {
    id: 20,
    src: "/images/gallery/image8.jpg",
    alt: "Gallery Image 20",
    width: 1000,
    height: 800,
  },
  {
    id: 21,
    src: "/images/gallery/image9.jpg",
    alt: "Gallery Image 21",
    width: 800,
    height: 1100,
  },
  {
    id: 22,
    src: "/images/gallery/image10.jpg",
    alt: "Gallery Image 22",
    width: 1200,
    height: 1300,
  },
  {
    id: 23,
    src: "/images/gallery/image11.jpg",
    alt: "Gallery Image 23",
    width: 800,
    height: 1000,
  },
  {
    id: 24,
    src: "/images/gallery/image12.jpg",
    alt: "Gallery Image 24",
    width: 1000,
    height: 1200,
  },
];

export default function GalleryPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-dark">
      <section className="pt-[120px] pb-16 md:pt-[150px] md:pb-[120px] xl:pt-[180px] xl:pb-[160px] 2xl:pt-[210px] 2xl:pb-[200px]">
        <div className="container">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4">
              <div className="mx-auto max-w-[800px] text-center">
                <h1 className="mb-5 text-3xl font-bold leading-tight text-black dark:text-white sm:text-4xl sm:leading-tight md:text-5xl md:leading-tight">
                  Our Gallery
                </h1>
                <p className="mb-12 text-base font-medium leading-relaxed text-body-color dark:text-body-color-dark sm:text-lg md:text-xl">
                  Explore our beautiful collection of images showcasing our work and creativity
                </p>
              </div>
            </div>
          </div>
        </div>
        <Gallery images={galleryImages} />
      </section>
    </main>
  );
} 
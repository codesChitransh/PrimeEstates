import React from 'react';

export default function About() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300 px-4 sm:px-6">
      <div className="bg-white/80 backdrop-blur-lg shadow-lg rounded-2xl p-6 sm:p-8 max-w-3xl w-full text-center border border-gray-200">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4 sm:mb-6">About <span className="text-blue-600">Prime Estates</span></h1>
        
        <p className="text-gray-700 leading-relaxed mb-3 sm:mb-4 text-sm sm:text-base">
          Prime Estates is a modern real estate platform designed to simplify the process of buying, selling, and renting properties. 
          Our platform leverages advanced web technologies to offer a seamless and secure experience for both property owners and buyers.
        </p>

        <p className="text-gray-700 leading-relaxed mb-3 sm:mb-4 text-sm sm:text-base">
          This project, built using the <span className="font-semibold text-gray-900">MERN stack</span>, allows users to upload property listings with images, manage their properties, and 
          securely authenticate using <span className="font-semibold text-gray-900">Google Authentication (GAuth)</span>. With an intuitive user interface and real-time updates, Prime Estates 
          ensures a hassle-free property transaction experience.
        </p>

        <p className="text-gray-700 leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base">
          At Prime Estates, we are committed to transforming the real estate industry by providing a <span className="text-gray-900 font-semibold">smart, efficient, and user-friendly </span> 
          platform. Whether you're a homeowner, an investor, or a real estate agent, our platform is designed to meet your needs with 
          the latest technology and innovative features.
        </p>

        <footer className="mt-4 sm:mt-6">
          <a 
            href="https://www.linkedin.com/in/chitranshsri/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-white bg-blue-600 px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-md transition duration-300 hover:bg-blue-700 hover:scale-105 text-sm sm:text-base"
          >
            Connect with me on LinkedIn
          </a>
        </footer>
      </div>
    </div>
  );
}

"use client"
import { useState } from 'react';

const ImageEdit = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [editedImageUrl, setEditedImageUrl] = useState('');

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = async (event) => {
      const imageBuffer = event.target.result;
      setImageUrl(URL.createObjectURL(file));
      await editImage(imageBuffer);
    };

    reader.readAsArrayBuffer(file);
  };

  const editImage = async (imageBuffer) => {
    const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY; // Replace with your actual API key
    const endpoint = 'https://api.openai.com/v1/vision/davinci/edit';
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    };

    const prompt = 'compare with android phone';
    const n = 1;
    const size = '256x256';

    const body = JSON.stringify({
      prompt,
      n,
      size
    });

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body
      });

      if (!response.ok) {
        throw new Error('Failed to fetch');
      }

      const data = await response.json();
      const imageUrl = data.output_url;
      setEditedImageUrl(imageUrl);
    } catch (error) {
      console.error('Error occurred during image editing:', error);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {imageUrl && <img src={imageUrl} alt="Original" />}
      {editedImageUrl && <img src={editedImageUrl} alt="Edited" />}
    </div>
  );
};

export default ImageEdit;

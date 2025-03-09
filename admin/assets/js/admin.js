document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('customization-form');

  // Load existing section data
  fetch('config/sections.json')
      .then(response => response.json())
      .then(data => {
          populateForm(data);
      })
      .catch(error => {
          console.error('Error loading section data:', error);
          // Use default data if fetch fails
          const defaultData = getDefaultData();
          populateForm(defaultData);
      });

  // Populate form with data
  function populateForm(data) {
      if (data.hero) {
          document.getElementById('hero-title').value = data.hero.title || '';
          document.getElementById('hero-description').value = data.hero.description || '';
          document.getElementById('hero-image').value = data.hero.imageUrl || '';
      }

      if (data.about) {
          document.getElementById('about-title').value = data.about.title || '';
          document.getElementById('about-content').value = data.about.content || '';
          document.getElementById('about-image').value = data.about.imageUrl || '';
      }

      if (data.guides) {
          document.getElementById('guides-title').value = data.guides.title || '';
          document.getElementById('guides-description').value = data.guides.description || '';
      }

      // Initialize preview with the same data
      updatePreview();
  }

  // Default data for initial display
  function getDefaultData() {
      return {
          hero: {
              title: "Bring life to your space with plants",
              description: "Learn how to care for your indoor plants with our expert guides and simple tips.",
              imageUrl: "https://images.unsplash.com/photo-1463320898484-cdee8141c787?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
          },
          about: {
              title: "About Verdant",
              content: "We believe that everyone deserves to enjoy the beauty and benefits of plants, regardless of experience level. Our mission is to make plant care accessible, enjoyable, and rewarding.",
              imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
          },
          guides: {
              title: "Essential Care Guides",
              description: "Everything you need to know to keep your plants thriving"
          }
      };
  }

  // Update preview based on current form values
  function updatePreview() {
      // Update Hero section
      const heroTitle = document.getElementById('hero-title').value;
      const heroDescription = document.getElementById('hero-description').value;
      const heroImage = document.getElementById('hero-image').value;

      document.getElementById('preview-hero-title').innerHTML =
          heroTitle ? formatTitle(heroTitle) : 'Bring <span class="text-primary font-medium">life</span> to your space with plants';
      document.getElementById('preview-hero-description').textContent =
          heroDescription || 'Learn how to care for your indoor plants with our expert guides and simple tips.';

      if (heroImage) {
          document.getElementById('preview-hero-image').src = heroImage;
      }

      // Update About section
      const aboutTitle = document.getElementById('about-title').value;
      const aboutContent = document.getElementById('about-content').value;
      const aboutImage = document.getElementById('about-image').value;

      document.getElementById('preview-about-title').innerHTML =
          aboutTitle ? formatTitle(aboutTitle) : 'About <span class="text-primary font-medium">Verdant</span>';
      document.getElementById('preview-about-content').textContent = aboutContent ||
          'We believe that everyone deserves to enjoy the beauty and benefits of plants, regardless of experience level. Our mission is to make plant care accessible, enjoyable, and rewarding.';

      if (aboutImage) {
          document.getElementById('preview-about-image').src = aboutImage;
      }

      // Update Guides section
      const guidesTitle = document.getElementById('guides-title').value;
      const guidesDescription = document.getElementById('guides-description').value;

      document.getElementById('preview-guides-title').innerHTML =
          guidesTitle ? formatTitle(guidesTitle) : 'Essential <span class="text-primary font-medium">Care Guides</span>';
      document.getElementById('preview-guides-description').textContent = guidesDescription ||
          'Everything you need to know to keep your plants thriving';
  }

  // Helper to format titles with highlighting
  function formatTitle(title) {
      // Look for words to highlight between * characters, like *word*
      return title.replace(/\*(.*?)\*/g, '<span class="text-primary font-medium">$1</span>');
  }

  // Add real-time preview for all form fields
  const formInputs = form.querySelectorAll('input, textarea');
  formInputs.forEach(input => {
      input.addEventListener('input', updatePreview);
  });

  // Handle form submission
  form.addEventListener('submit', function(event) {
      event.preventDefault();

      // Create data object from form values
      const formData = {
          hero: {
              title: document.getElementById('hero-title').value,
              description: document.getElementById('hero-description').value,
              imageUrl: document.getElementById('hero-image').value
          },
          about: {
              title: document.getElementById('about-title').value,
              content: document.getElementById('about-content').value,
              imageUrl: document.getElementById('about-image').value
          },
          guides: {
              title: document.getElementById('guides-title').value,
              description: document.getElementById('guides-description').value
          }
      };

      // Display save confirmation
      saveData(formData);
  });

  // Simulate saving data to the server
  function saveData(data) {
      console.log('Saving data:', data);

      // Add a success message
      const saveMessage = document.createElement('div');
      saveMessage.className = 'fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-md shadow-lg';
      saveMessage.textContent = 'Changes saved successfully!';
      document.body.appendChild(saveMessage);

      // Remove the message after 3 seconds
      setTimeout(() => {
          saveMessage.remove();
      }, 3000);

      // In a real application, you would send this data to the server
      // fetch('/save-config', {
      //     method: 'POST',
      //     headers: {
      //         'Content-Type': 'application/json',
      //     },
      //     body: JSON.stringify(data)
      // }).then(response => response.json())
      //   .then(result => console.log('Success:', result))
      //   .catch(error => console.error('Error:', error));
  }
});
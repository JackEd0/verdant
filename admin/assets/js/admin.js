document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('customization-form');

  // Load existing section data
  fetch('config/sections.json')
    .then((response) => response.json())
    .then((data) => {
      populateForm(data);
    })
    .catch((error) => {
      console.error('Error loading section data:', error);
      // Use default data if fetch fails
      const defaultData = getDefaultData();
      populateForm(defaultData);
    });

  // Populate form with data
  function populateForm(data) {
    if (data.hero) {
      document.getElementById('hero-heading').value = data.hero.title || '';
      document.getElementById('hero-subheading').value = data.hero.description || '';
      document.getElementById('hero-button-text').value = data.hero.buttonText || '';
      document.getElementById('hero-image').value = data.hero.imageUrl || '';
    }

    if (data.about) {
      document.getElementById('about-heading').value = data.about.title || '';

      // Handle the about content in the textarea
      if (data.about.paragraphs && Array.isArray(data.about.paragraphs)) {
        // Join paragraphs with newlines for the textarea
        document.getElementById('about-content').value = data.about.paragraphs.join('\n\n');
      } else if (data.about.content) {
        document.getElementById('about-content').value = data.about.content;
      }

      document.getElementById('about-button-text').value = data.about.buttonText || '';
      document.getElementById('about-image').value = data.about.imageUrl || '';
    }

    if (data.guides) {
      document.getElementById('guides-heading').value = data.guides.title || '';
      document.getElementById('guides-subheading').value = data.guides.description || '';
    }
  }

  // Default data for initial display
  function getDefaultData() {
    return {
      hero: {
        title: 'Bring life to your space with plants',
        description: 'Learn how to care for your indoor plants with our expert guides and simple tips.',
        buttonText: 'Get Started',
        imageUrl:
          'https://images.unsplash.com/photo-1463320898484-cdee8141c787?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      },
      about: {
        title: 'About Verdant',
        content:
          'We believe that everyone deserves to enjoy the beauty and benefits of plants, regardless of experience level. Our mission is to make plant care accessible, enjoyable, and rewarding.',
        buttonText: 'Learn More',
        imageUrl:
          'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      },
      guides: {
        title: 'Essential Care Guides',
        description: 'Everything you need to know to keep your plants thriving',
      },
    };
  }

  // Handle form submission
  form.addEventListener('submit', function (event) {
    event.preventDefault();

    // Create data object from form values
    const formData = {
      hero: {
        title: document.getElementById('hero-heading').value,
        description: document.getElementById('hero-subheading').value,
        buttonText: document.getElementById('hero-button-text').value,
        imageUrl: document.getElementById('hero-image').value,
      },
      about: {
        title: document.getElementById('about-heading').value,
        // Handle content collection based on your implementation
        buttonText: document.getElementById('about-button-text').value,
        imageUrl: document.getElementById('about-image').value,
      },
      guides: {
        title: document.getElementById('guides-heading').value,
        description: document.getElementById('guides-subheading').value,
      },
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

  // Section selector functionality
  const sectionSelector = document.getElementById('section-selector');
  const sectionForms = document.querySelectorAll('.section-form');

  sectionSelector.addEventListener('change', function () {
    const selectedSection = this.value;

    // Hide all section forms
    sectionForms.forEach((form) => {
      form.classList.add('hidden');
    });

    // Show selected section form
    document.getElementById(`${selectedSection}-section-form`).classList.remove('hidden');
  });

  // Layout toggle functionality
  const defaultViewBtn = document.getElementById('default-view');
  const editorViewBtn = document.getElementById('editor-view');
  const previewViewBtn = document.getElementById('preview-view');

  const formSection = document.getElementById('form-section');
  const previewSectionContainer = document.getElementById('preview-section-container');
  const layoutContainer = document.getElementById('layout-container');

  // Function to set active button styles
  function setActiveButton(activeBtn) {
    // Reset all buttons
    [defaultViewBtn, editorViewBtn, previewViewBtn].forEach((btn) => {
      btn.classList.remove('bg-primary', 'text-white');
      btn.classList.add('bg-white', 'text-gray-700', 'hover:bg-gray-100');
    });

    // Set active button
    activeBtn.classList.remove('bg-white', 'text-gray-700', 'hover:bg-gray-100');
    activeBtn.classList.add('bg-primary', 'text-white');
  }

  // Default view (both panels)
  defaultViewBtn.addEventListener('click', function () {
    formSection.classList.remove('lg:w-full', 'hidden');
    previewSectionContainer.classList.remove('lg:w-full', 'hidden');
    formSection.classList.add('lg:w-1/2');
    previewSectionContainer.classList.add('lg:w-1/2');
    layoutContainer.classList.add('lg:flex-row');
    setActiveButton(defaultViewBtn);
  });

  // Editor-only view
  editorViewBtn.addEventListener('click', function () {
    formSection.classList.remove('lg:w-1/2', 'hidden');
    formSection.classList.add('lg:w-full');
    previewSectionContainer.classList.add('hidden');
    previewSectionContainer.classList.remove('lg:w-1/2', 'lg:w-full');
    layoutContainer.classList.remove('lg:flex-row');
    setActiveButton(editorViewBtn);
  });

  // Preview-only view
  previewViewBtn.addEventListener('click', function () {
    previewSectionContainer.classList.remove('lg:w-1/2', 'hidden');
    previewSectionContainer.classList.add('lg:w-full');
    formSection.classList.add('hidden');
    formSection.classList.remove('lg:w-1/2', 'lg:w-full');
    layoutContainer.classList.remove('lg:flex-row');
    setActiveButton(previewViewBtn);
  });
});

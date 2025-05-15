document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('customization-form');

  // Load existing site data
  fetch('config/site.json')
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
    // Check if data is in the expected structure
    const sections = data.sections || [];

    // Find each section by id and populate corresponding form fields
    const heroSection = sections.find(section => section.id === 'hero');
    if (heroSection && heroSection.content) {
      document.getElementById('hero-heading').value = heroSection.content.heading || '';
      document.getElementById('hero-subheading').value = heroSection.content.subheading || '';
      document.getElementById('hero-button-text').value = heroSection.content.buttonText || '';
      document.getElementById('hero-image').value = heroSection.content.image || '';
    }

    const aboutSection = sections.find(section => section.id === 'about');
    if (aboutSection && aboutSection.content) {
      document.getElementById('about-heading').value = aboutSection.content.heading || '';

      // Handle the about content in the textarea
      if (aboutSection.content.paragraphs && Array.isArray(aboutSection.content.paragraphs)) {
        // Join paragraphs with newlines for the textarea
        document.getElementById('about-content').value = aboutSection.content.paragraphs.join('\n\n');
      } else if (aboutSection.content.content) {
        document.getElementById('about-content').value = aboutSection.content.content;
      }

      document.getElementById('about-button-text').value = aboutSection.content.buttonText || '';
      document.getElementById('about-image').value = aboutSection.content.image || '';
    }

    const guidesSection = sections.find(section => section.id === 'care-guides');
    if (guidesSection && guidesSection.content) {
      document.getElementById('guides-heading').value = guidesSection.content.heading || '';
      document.getElementById('guides-subheading').value = guidesSection.content.subheading || '';
    }

    // Populate section selector
    populateSectionSelector(sections);
  }

  // Populate the section selector dropdown
  function populateSectionSelector(sections) {
    const sectionSelector = document.getElementById('section-selector');
    sectionSelector.innerHTML = ''; // Clear existing options

    // Add options for each section
    sections.forEach(section => {
      const option = document.createElement('option');
      option.value = section.id;
      option.textContent = section.title;
      sectionSelector.appendChild(option);
    });

    // Trigger change event to show the first section
    sectionSelector.dispatchEvent(new Event('change'));
  }

  // Default data for initial display
  function getDefaultData() {
    return {
      "sections": [
        {
          "id": "hero",
          "title": "Hero Section",
          "content": {
            "heading": "Bring life to your space with plants",
            "subheading": "Learn how to care for your indoor plants with our expert guides and simple tips.",
            "buttonText": "Get Started",
            "image": "https://images.unsplash.com/photo-1463320898484-cdee8141c787?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80"
          }
        },
        {
          "id": "about",
          "title": "About Section",
          "content": {
            "heading": "About Verdant",
            "paragraphs": [
              "We believe that everyone deserves to enjoy the beauty and benefits of plants, regardless of experience level.",
              "Our mission is to make plant care accessible, enjoyable, and rewarding."
            ],
            "buttonText": "Learn More",
            "image": "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80"
          }
        },
        {
          "id": "care-guides",
          "title": "Care Guides Section",
          "content": {
            "heading": "Essential Care Guides",
            "subheading": "Everything you need to know to keep your plants thriving",
            "guides": []
          }
        },
        {
          "id": "newsletter",
          "title": "Newsletter Section",
          "content": {
            "heading": "Join Our Plant Community",
            "description": "Sign up for our newsletter to receive seasonal care tips, exclusive guides, and plant inspiration.",
            "buttonText": "Subscribe",
            "inputPlaceholder": "Your email address"
          }
        },
        {
          "id": "testimonials",
          "title": "Testimonials Section",
          "content": {
            "heading": "What Our Community Says",
            "subheading": "Hear from plant lovers who've transformed their spaces",
            "testimonials": []
          }
        }
      ]
    };
  }

  // Handle form submission
  form.addEventListener('submit', async function (event) {
    event.preventDefault();

    // Get the current site data
    let currentData;
    try {
      const response = await fetch('config/site.json');
      currentData = await response.json();
    } catch (error) {
      console.error('Error loading current data:', error);
      currentData = getDefaultData();
    }

    // Update the data with form values
    const sections = currentData.sections || [];

    // Update Hero section
    const heroIndex = sections.findIndex(section => section.id === 'hero');
    if (heroIndex >= 0) {
      sections[heroIndex].content.heading = document.getElementById('hero-heading').value;
      sections[heroIndex].content.subheading = document.getElementById('hero-subheading').value;
      sections[heroIndex].content.buttonText = document.getElementById('hero-button-text').value;
      sections[heroIndex].content.image = document.getElementById('hero-image').value;
    }

    // Update About section
    const aboutIndex = sections.findIndex(section => section.id === 'about');
    if (aboutIndex >= 0) {
      sections[aboutIndex].content.heading = document.getElementById('about-heading').value;
      sections[aboutIndex].content.paragraphs = document.getElementById('about-content').value.split('\n\n');
      sections[aboutIndex].content.buttonText = document.getElementById('about-button-text').value;
      sections[aboutIndex].content.image = document.getElementById('about-image').value;
    }

    // Update Guides section
    const guidesIndex = sections.findIndex(section => section.id === 'care-guides');
    if (guidesIndex >= 0) {
      sections[guidesIndex].content.heading = document.getElementById('guides-heading').value;
      sections[guidesIndex].content.subheading = document.getElementById('guides-subheading').value;
    }

    // Display save confirmation
    saveData({ sections });
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

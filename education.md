---
layout: default
title: Education
heading: Education
tagline: What I've studied and achieved along the way.
permalink: /education/
---

<section class="resume-section">
  <h2>Education</h2>
  {% for school in site.data.education %}
  <div class="resume-entry">
    <div class="resume-entry-header">
      <h3>{{ school.degree }}<span class="resume-org"> · {{ school.institution }}</span></h3>
      <p class="resume-dates">{% if school.start and school.start != school.end %}{{ school.start }} – {% endif %}{{ school.end }}</p>
    </div>
    {% if school.details %}
    <ul>
      {% for detail in school.details %}
      <li>{{ detail }}</li>
      {% endfor %}
    </ul>
    {% endif %}
  </div>
  {% endfor %}
</section>

---
layout: default
title: Projects
permalink: /projects/
---

{% assign university_projects = site.projects | where: "category", "university" %}
{% assign extracurricular_projects = site.projects | where: "category", "extracurricular" %}

<section class="project-section">
  <h2>University Projects</h2>
  {% if university_projects.size > 0 %}
    {% include project-grid.html projects=university_projects %}
  {% else %}
    <p class="text-dim">Nothing here yet — check back soon.</p>
  {% endif %}
</section>

<section class="project-section">
  <h2>Extracurricular Projects</h2>
  {% if extracurricular_projects.size > 0 %}
    {% include project-grid.html projects=extracurricular_projects %}
  {% else %}
    <p class="text-dim">Nothing here yet — check back soon.</p>
  {% endif %}
</section>

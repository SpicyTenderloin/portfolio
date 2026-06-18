---
layout: default
title: Projects
permalink: /projects/
---

{% assign personal_projects = site.projects | where: "category", "personal" %}
{% assign club_projects = site.projects | where: "category", "club" %}
{% assign university_projects = site.projects | where: "category", "university" %}

<section class="project-section">
  <h2>Personal Projects</h2>
  {% if personal_projects.size > 0 %}
    {% include project-grid.html projects=personal_projects %}
  {% else %}
    <p class="text-dim">Nothing here yet, check back soon.</p>
  {% endif %}
</section>

<section class="project-section">
  <h2>Club Projects</h2>
  {% if club_projects.size > 0 %}
    {% include project-grid.html projects=club_projects %}
  {% else %}
    <p class="text-dim">Nothing here yet, check back soon.</p>
  {% endif %}
</section>

<section class="project-section">
  <h2>University Projects</h2>
  {% if university_projects.size > 0 %}
    {% include project-grid.html projects=university_projects %}
  {% else %}
    <p class="text-dim">Nothing here yet, check back soon.</p>
  {% endif %}
</section>

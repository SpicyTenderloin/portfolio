---
layout: default
title: Skills
heading: Skills
tagline: Click a skill to see the projects that use it.
permalink: /skills/
---

{% assign all_skills = "" | split: "," %}
{% for project in site.projects %}
  {% if project.skills %}
    {% assign all_skills = all_skills | concat: project.skills %}
  {% endif %}
{% endfor %}
{% assign unique_skills = all_skills | uniq | sort_natural %}

{% if unique_skills.size > 0 %}
<div class="skills-list">
  {% for skill in unique_skills %}
  {% assign matching = site.projects | where_exp: "p", "p.skills contains skill" %}
  <details id="{{ skill | slugify }}" class="skill-accordion">
    <summary>{{ skill }}<span class="skill-count">{{ matching.size }} project{% if matching.size != 1 %}s{% endif %}</span></summary>
    {% include project-grid.html projects=matching %}
  </details>
  {% endfor %}
</div>
{% else %}
<p class="text-dim">Nothing here yet, check back soon.</p>
{% endif %}

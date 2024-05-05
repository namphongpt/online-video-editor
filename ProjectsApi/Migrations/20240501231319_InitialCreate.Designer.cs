﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using ProjectsApi.Models;

#nullable disable

namespace ProjectsApi.Migrations
{
    [DbContext(typeof(ProjectsContext))]
    [Migration("20240501231319_InitialCreate")]
    partial class InitialCreate
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.4")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("ProjectsApi.Models.Clip", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<Guid>("MediaAssetId")
                        .HasColumnType("uuid");

                    b.Property<int>("OffsetEndMs")
                        .HasColumnType("integer");

                    b.Property<int>("OffsetStartMs")
                        .HasColumnType("integer");

                    b.Property<Guid>("ProjectId")
                        .HasColumnType("uuid");

                    b.Property<int>("StartTimeMs")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.HasIndex("ProjectId");

                    b.ToTable("Clips");
                });

            modelBuilder.Entity("ProjectsApi.Models.Project", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("Projects");
                });

            modelBuilder.Entity("ProjectsApi.Models.Clip", b =>
                {
                    b.HasOne("ProjectsApi.Models.Project", "Project")
                        .WithMany("Clips")
                        .HasForeignKey("ProjectId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Project");
                });

            modelBuilder.Entity("ProjectsApi.Models.Project", b =>
                {
                    b.Navigation("Clips");
                });
#pragma warning restore 612, 618
        }
    }
}

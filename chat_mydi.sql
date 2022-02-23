-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : lun. 21 fév. 2022 à 14:15
-- Version du serveur : 10.4.22-MariaDB
-- Version de PHP : 7.4.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `chat_mydi`
--

-- --------------------------------------------------------

--
-- Structure de la table `messages`
--

CREATE TABLE `messages` (
  `message_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `content` varchar(255) NOT NULL,
  `id_user` int(12) NOT NULL,
  `id_room` int(12) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Structure de la table `roles`
--

CREATE TABLE `roles` (
  `role_id` int(12) NOT NULL,
  `name` varchar(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Structure de la table `rooms`
--

CREATE TABLE `rooms` (
  `room_id` int(12) NOT NULL,
  `Name` varchar(64) NOT NULL,
  `Image` varchar(64) NOT NULL,
  `Private` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Structure de la table `rooms_users`
--

CREATE TABLE `rooms_users` (
  `rooms_users_id` int(12) NOT NULL,
  `id_room` int(12) NOT NULL,
  `id_user` int(12) NOT NULL,
  `id_role` int(12) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `user_id` int(12) NOT NULL,
  `pseudo` varchar(64) NOT NULL,
  `password` varchar(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`message_id`),
  ADD KEY `id_user` (`id_user`,`id_room`),
  ADD KEY `id_room` (`id_room`);

--
-- Index pour la table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`role_id`);

--
-- Index pour la table `rooms`
--
ALTER TABLE `rooms`
  ADD PRIMARY KEY (`room_id`);

--
-- Index pour la table `rooms_users`
--
ALTER TABLE `rooms_users`
  ADD PRIMARY KEY (`rooms_users_id`),
  ADD KEY `id_room` (`id_room`,`id_user`,`id_role`),
  ADD KEY `id_role` (`id_role`),
  ADD KEY `id_user` (`id_user`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `messages`
--
ALTER TABLE `messages`
  MODIFY `message_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `roles`
--
ALTER TABLE `roles`
  MODIFY `role_id` int(12) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `rooms`
--
ALTER TABLE `rooms`
  MODIFY `room_id` int(12) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `rooms_users`
--
ALTER TABLE `rooms_users`
  MODIFY `rooms_users_id` int(12) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(12) NOT NULL AUTO_INCREMENT;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`id_room`) REFERENCES `rooms` (`room_id`),
  ADD CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`id_user`) REFERENCES `users` (`user_id`);

--
-- Contraintes pour la table `rooms_users`
--
ALTER TABLE `rooms_users`
  ADD CONSTRAINT `rooms_users_ibfk_1` FOREIGN KEY (`id_role`) REFERENCES `roles` (`role_id`),
  ADD CONSTRAINT `rooms_users_ibfk_2` FOREIGN KEY (`id_user`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `rooms_users_ibfk_3` FOREIGN KEY (`id_room`) REFERENCES `rooms` (`room_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

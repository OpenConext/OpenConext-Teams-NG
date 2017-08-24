UPDATE invitations SET intended_role = 'MEMBER' where intended_role = 'Member';
UPDATE invitations SET intended_role = 'MANAGER' where intended_role = 'Manager';
UPDATE invitations SET intended_role = 'ADMIN' where intended_role = 'Admin';